import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as auth from '../../src/auth/auth';
import User from '../../src/models/user';

const { expect } = chai;

chai.use(chaiAsPromised);

describe('Auth Test', () => {
  const user = new User({ username: 'test', mobile: '1234567', _id: 'axxax' });
  it('Should return the signed token', async () => {
    const token = auth.sign(user);
    expect(token).to.be.not.null;
    expect(token).to.be.not.undefined;
  });

  it('Should get the payload from the signed token', async () => {
    const token = auth.sign(user);
    const payload = await auth.verify(token);
    expect(payload).to.be.not.null;
    expect(payload).to.be.not.undefined;
    expect(payload.id).to.be.equal(user.id);
    expect(payload.username).to.be.equal(user.username);
    expect(payload.mobile).to.be.equal(user.mobile);
  });

  it('Should throw an error when sending the wrong token', async () => {
    const token = `${auth.sign(user)}_failed`;
    expect(auth.verify(token)).to.eventually.be.rejectedWith(Error);
  });
});
