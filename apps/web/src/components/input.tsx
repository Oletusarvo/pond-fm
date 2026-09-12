import React from "react";

type InputProps = React.ComponentProps<"input">;
export function Input(props: InputProps) {
  return (
    <InputContainer>
      <input {...props} className='w-full px-4 py-2 outline-0' />
    </InputContainer>
  );
}

type TextareaProps = React.ComponentProps<"textarea">;
export function Textarea(props: TextareaProps) {
  return (
    <InputContainer>
      <textarea {...props} className='resize-none min-h-24 w-full px-4 py-2' />
    </InputContainer>
  );
}

function InputContainer({ children }: React.PropsWithChildren) {
  return (
    <div className='w-full border rounded-md border-slate-200 text-slate-500 overflow-hidden'>
      {children}
    </div>
  );
}
