import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'name' : string, 'items' : Array<CategoryItem> }
export interface CategoryItem {
  'id' : bigint,
  'name' : string,
  'emoji' : string,
}
export interface GroceryItem {
  'id' : bigint,
  'name' : string,
  'completed' : boolean,
  'emoji' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'addToCart' : ActorMethod<[bigint], Result>,
  'getCartItems' : ActorMethod<[], Array<GroceryItem>>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'removeFromCart' : ActorMethod<[bigint], Result>,
  'toggleItemCompletion' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
