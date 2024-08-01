import type { DraggableProvided } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import { CardEvent } from "../../common/enums/card-event.enum";
import { socket } from "../../context/socket";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  listId: string;
};

export const CardItem = ({ card, isDragging, provided, listId }: Props) => {
  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title onChange={(newName) => {
          const cardId = card.id;
          if (newName === "") {
            alert("Card name cannot be empty");
          } else {
            socket.emit(CardEvent.RENAME, { listId, cardId, newName });;
          }
        }} title={card.name} fontSize="large" isBold />
        <Text text={card.description} onChange={(newDescription) => {
          const cardId = card.id;
          socket.emit(CardEvent.CHANGE_DESCRIPTION, { listId, cardId, newDescription });
        }} />
        <Footer>
          <DeleteButton onClick={() => {
            const cardId = card.id;
            socket.emit(CardEvent.DELETE, {listId, cardId});
           }} />
          <Splitter />
          <CopyButton onClick={() => {
            const cardId = card.id;
            socket.emit(CardEvent.DUPLICATE, {listId, cardId});
           }} />
        </Footer>
      </Content>
    </Container>
  );
};
