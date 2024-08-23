export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const GroceryItem = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'completed' : IDL.Bool,
    'emoji' : IDL.Text,
  });
  const CategoryItem = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'emoji' : IDL.Text,
  });
  const Category = IDL.Record({
    'name' : IDL.Text,
    'items' : IDL.Vec(CategoryItem),
  });
  return IDL.Service({
    'addToCart' : IDL.Func([IDL.Nat], [Result], []),
    'getCartItems' : IDL.Func([], [IDL.Vec(GroceryItem)], ['query']),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'removeFromCart' : IDL.Func([IDL.Nat], [Result], []),
    'toggleItemCompletion' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
