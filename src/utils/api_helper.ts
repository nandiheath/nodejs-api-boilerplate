
import User from '../models/user';
import {
  entityNotFound, unauthoirzedRequest, entityAlreadyExists, dbConnectionFailed, internalError
} from './api_error';
const passport = require('passport');
// const { logger } = require('./../utils/logger');

/**
 * Middleware for handling passport authenication
 * http://www.passportjs.org/docs/downloads/html/
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const passportAuthenicate = (authMethod) => {
  return (req, res, next) => {
    passport.authenticate(authMethod, (err, user) => {
      if (err) {
        if (err.code === 11000) {
          return next(entityAlreadyExists());
        }
        return next(internalError(err));
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return next();
      })
    })(req, res, next);
  }
}

export const formatResponse = (data) => { // eslint-disable-line
  return {
    success: true,
    data
  };
};

export const formatPagination = (paginationData) => { // eslint-disable-line
  return {
    success: true,
    data: paginationData.docs,
    total: paginationData.total,
    limit: paginationData.limit,
    page: paginationData.page,
    pages: paginationData.pages,
  };
};


export const getUserFromReq = async (req) => {
  const { id } = req.session.passport.user;
  const user = await User.findById(id);
  if (user === null) {
    throw unauthoirzedRequest();
  }
  return user;
};

export const getSearchQueryFromRequest = (req) => {
  const search = JSON.parse(req.query.search);
  return search;
};

export function ensureInt(str, defaulValue) {
  const result = parseInt(str, 10);
  return Number.isNaN(result) ? defaulValue : result;
}

export const getPaginationFromParam = (req) => {
  const page = ensureInt(req.query.page, 1);
  const limit = ensureInt(req.query.limit, 100);

  return {
    page, limit
  };
};


export const listModel = ModelClass => async (req, res, next) => {
  const instances = await ModelClass.paginate({}, getPaginationFromParam(req));
  res.send(formatPagination(instances));
  return next();
};


export const getModel = ModelClass => async (req, res, next) => {
  const { id } = req.params;
  const instance = await ModelClass.findById(id);
  if (instance === null) {
    return next(entityNotFound());
  }

  res.send(formatResponse(instance));
  return next();
};


export const createModel = ModelClass => async (req, res, next) => {
  const instance = new ModelClass(req.body);
  await instance.save();
  res.send(formatResponse(instance));
  return next();
};

export const updateModel = ModelClass => async (req, res, next) => {
  const { id } = req.params;
  const instance = await ModelClass.findById(id);
  if (instance === null) {
    return next(entityNotFound());
  }

  const doc = req.body;

  // Prevent saving something with the ids
  const protectedFields = ModelClass.protectedFields ? ModelClass.protectedFields() : [];
  for (const field of protectedFields) {
    if (doc[field]) {
      delete doc[field];
    }
  }

  instance.set(req.body);
  await instance.save();
  res.send(formatResponse(instance));
  return next();
};

export const addSubDocToModel = (ModelClass, fieldName) => async (req, res, next) => {
  const { id, subdoc_id } = req.params;
  const instance = await ModelClass.findById(id);
  if (instance === null) {
    return next(entityNotFound());
  }

  const subdoc = instance[fieldName].find(doc => doc.id === subdoc_id);
  if (subdoc !== undefined) {
    return next(entityAlreadyExists());
  }

  // update and return the document
  const result = await instance.updateOne({
    $push: {
      [fieldName]: { _id: subdoc_id }
    }
  });

  if (result.ok) {
    res.send(formatResponse({}));
  } else {
    return next(dbConnectionFailed());
  }
  return next();
};

export const removeSubDocToModel = (ModelClass, fieldName) => async (req, res, next) => {
  const { id, subdoc_id } = req.params;
  const instance = await ModelClass.findById(id);
  if (instance === null) {
    return next(entityNotFound());
  }

  const subdoc = instance[fieldName].find(doc => doc.id === subdoc_id);
  if (subdoc === undefined) {
    return next(entityNotFound());
  }

  const updateDoc = {
    $pull: {
      [fieldName]: subdoc._id
    }
  };
  // update and return the document
  const result = await instance.update(updateDoc);

  if (result.ok) {
    res.send(formatResponse({}));
  } else {
    return next(dbConnectionFailed());
  }
  return next();
};

