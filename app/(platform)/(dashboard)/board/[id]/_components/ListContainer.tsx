"use client";
import { ListWithCards } from "@/types";
import ListForm from "./ListForm";
import ListItem from "./ListItem";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { updateCardOrder } from "@/actions/update-card order";
import { updateListOrder } from "@/actions/update-list order";
import { useAction } from "@/hoooks/use-action";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ListContainerProps = {
  data: ListWithCards[];
  boardId: string;
};

function reOrder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // if dropped in the same position

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // if user moves a list
    if (type === "list") {
      const items = reOrder(orderedData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }
    // if user moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) return;

      // Check if cards exist on the source List
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exist on the destinationList
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving card in the same list
      if (source.droppableId === destination.droppableId) {
        const reOrderedCards = reOrder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reOrderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reOrderedCards;

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ boardId: boardId, items: reOrderedCards });
        // User moves the card to another list
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new list to the moved card
        movedCard.listdId = destination.droppableId;

        // Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // update the order for each card in the destination list
        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: destinationList.cards,
        });
      }
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full overflow-x-auto"
          >
            {orderedData.map((list, idx) => (
              <ListItem key={list.id} index={idx} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
