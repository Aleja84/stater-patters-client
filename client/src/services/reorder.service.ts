import type { DraggableLocation } from "@hello-pangea/dnd";
import { type Card, type List } from "../common/types/types";
import * as R from "ramda";

// Function to remove an item from a list
const removeItem = (index: number, list: any[]) => R.remove(index, 1, list);

// Function to add an item to a list
const addItem = (index: number, item: any, list: any[]) => R.insert(index, item, list);

// Function to reorder lists
const reorderLists = (items: List[], startIndex: number, endIndex: number): List[] => {
  const item = items[startIndex];
  const withoutItem = removeItem(startIndex, items);
  return addItem(endIndex, item, withoutItem);
};

// Function to reorder cards within the same list
const reorderCardsInSameList = (cards: Card[], startIndex: number, endIndex: number): Card[] => {
  const card = cards[startIndex];
  const withoutCard = removeItem(startIndex, cards);
  return addItem(endIndex, card, withoutCard);
};

// Function to reorder cards across different lists
const reorderCardsAcrossLists = (
  lists: List[], 
  source: DraggableLocation, 
  destination: DraggableLocation
): List[] => {
  const sourceList = lists.find(list => list.id === source.droppableId)!;
  const destList = lists.find(list => list.id === destination.droppableId)!;
  const card = sourceList.cards[source.index];

  const newSourceCards = removeItem(source.index, sourceList.cards);
  const newDestCards = addItem(destination.index, card, destList.cards);

  return lists.map(list => {
    if (list.id === source.droppableId) {
      return { ...list, cards: newSourceCards };
    } else if (list.id === destination.droppableId) {
      return { ...list, cards: newDestCards };
    }
    return list;
  });
};

// Function to reorder cards
const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  if (source.droppableId === destination.droppableId) {
    return lists.map(list => 
      list.id === source.droppableId 
        ? { ...list, cards: reorderCardsInSameList(list.cards, source.index, destination.index) } 
        : list
    );
  }
  return reorderCardsAcrossLists(lists, source, destination);
};

export const reorderService = {
  reorderLists,
  reorderCards
};