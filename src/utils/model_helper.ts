/**
 * Helper function to remove the important fields
 * @param fieldsToHide: string[]
 */
export function jsonTransform(fieldsToHide: string[]): (doc: object, ret: object) => object {
  return (doc: any, ret: any) => {
    ret.id = doc.id;
    delete ret._id;
    delete ret.__v;
    delete ret.created_at;
    delete ret.updated_at;
    for (const field of fieldsToHide) {
      delete ret[field];
    }
    return ret;
  };
}
