import React from 'react';
import styled, { css } from 'styled-components/macro';

type Props = {
  dragOverlay?: boolean;
  disabled?: boolean;
  columns: number;
  isEmpty?: boolean;
};


const Container = styled.div<{ columns: number; dragOverlay?: boolean; isEmpty?: boolean; }>`
  border: 2px solid black;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  font-size: larger;

  ${({ columns, dragOverlay, isEmpty }) => {
    if (isEmpty) {
      return css`
        background-color: transparent;
        border-style: dashed;
        cursor: not-allowed;
      `
    }

    if (dragOverlay) {
      return `
        background-color: gray;
        opacity: 0.7;
      `;
    }

    const color = columns > 1 ? '#82ff82' : '#00adff';

    return `background-color: ${color};`;
  }}
`;

export const Item = ({ columns, dragOverlay, isEmpty, children }: React.PropsWithChildren<Props>) => {
  return (
    <Container dragOverlay={dragOverlay} columns={columns} isEmpty={isEmpty}>
      {children}
    </Container>
  );
}