import clsx from 'clsx';
import React from 'react';

type Props = { selected: boolean };

const AddInvoice = ({ selected }: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C11.4477 2 11 2.44772 11 3V11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H13V3C13 2.44772 12.5523 2 12 2Z"
        className={clsx(
          'dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#BABABB] group-hover:fill-[#7540A9]',
          { 'dark:!fill-[#C8C7FF] fill-[#7540A9] ': selected }
        )}
      />
      <path
        d="M12 7C11.4477 7 11 7.44772 11 8V10H9C8.44772 10 8 10.4477 8 11C8 11.5523 8.44772 12 9 12H11V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V12H15C15.5523 12 16 11.5523 16 11C16 10.4477 15.5523 10 15 10H13V8C13 7.44772 12.5523 7 12 7Z"
        className={clsx(
          'dark:group-hover:fill-[#9F54FF] transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-[#BD8AFF]',
          { 'dark:!fill-[#7540A9] fill-[#BD8AFF] ': selected }
        )}
      />
    </svg>
  );
};

export default AddInvoice;
