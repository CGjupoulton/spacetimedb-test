import { useState, useEffect } from "react";
import {Steve, DbConnection, EventContext, User, Food } from "./module_bindings";

function useEntityMap<T>(
  conn: DbConnection | null,
  iter: () => Iterable<T>,
  onInsert: (handler: (ctx: EventContext, entity: T) => void) => void,
  onUpdate: (handler: (ctx: EventContext, oldEntity: T, newEntity: T) => void) => void,
  onDelete: (handler: (ctx: EventContext, entity: T) => void) => void,
  removeOnInsert: (handler: (ctx: EventContext, entity: T) => void) => void,
  removeOnUpdate: (handler: (ctx: EventContext, oldEntity: T, newEntity: T) => void) => void,
  removeOnDelete: (handler: (ctx: EventContext, entity: T) => void) => void,
  keyFn: (entity: T) => string
): Map<string, T> {
  const [entities, setEntities] = useState<Map<string, T>>(new Map());

  useEffect(() => {
    if (!conn) return;

    for (const entity of iter()) {
      setEntities(prev => new Map(prev.set(keyFn(entity), entity)));
    }

    const handleInsert = (_ctx: EventContext, entity: T) => {
      setEntities(prev => new Map(prev.set(keyFn(entity), entity)));
    };

    const handleUpdate = (_ctx: EventContext, oldEntity: T, newEntity: T) => {
      setEntities(prev => {
        prev.delete(keyFn(oldEntity));
        return new Map(prev.set(keyFn(newEntity), newEntity));
      });
    };

    const handleDelete = (_ctx: EventContext, entity: T) => {
      setEntities(prev => {
        prev.delete(keyFn(entity));
        return new Map(prev);
      });
    };

    onInsert(handleInsert);
    onUpdate(handleUpdate);
    onDelete(handleDelete);

    return () => {
      removeOnInsert(handleInsert);
      removeOnUpdate(handleUpdate);
      removeOnDelete(handleDelete);
    };
  }, [conn]);

  return entities;
}

export function useSteves(conn: DbConnection | null): Map<string, Steve> {
  return useEntityMap<Steve>(
    conn,
    () => conn!.db.steve.iter(),
    h => conn!.db.steve.onInsert(h),
    h => conn!.db.steve.onUpdate(h),
    h => conn!.db.steve.onDelete(h),
    h => conn!.db.steve.removeOnInsert(h),
    h => conn!.db.steve.removeOnUpdate(h),
    h => conn!.db.steve.removeOnDelete(h),
    s => s.user.toHexString()
  );
}

export function useUsers(conn: DbConnection | null): Map<string, User> {
  return useEntityMap<User>(
    conn,
    () => conn!.db.user.iter(),
    h => conn!.db.user.onInsert(h),
    h => conn!.db.user.onUpdate(h),
    h => conn!.db.user.onDelete(h),
    h => conn!.db.user.removeOnInsert(h),
    h => conn!.db.user.removeOnUpdate(h),
    h => conn!.db.user.removeOnDelete(h),
    user => user.identity.toHexString()
  );
}

export function useFoods(conn: DbConnection | null): Map<string, Food> {
  return useEntityMap<Food>(
    conn,
    () => conn!.db.food.iter(),
    h => conn!.db.food.onInsert(h),
    h => conn!.db.food.onUpdate(h),
    h => conn!.db.food.onDelete(h),
    h => conn!.db.food.removeOnInsert(h),
    h => conn!.db.food.removeOnUpdate(h),
    h => conn!.db.food.removeOnDelete(h),
    food => `${food.position.x}-${food.position.y}`
  );
}