import { forwardRef, FormEvent } from "react";
import { useMaskito } from "@maskito/react";
import type { MaskitoOptions } from "@maskito/core";
import { Input } from "@/components/ui/input";

type AccountType = "cpf" | "cnpj";

function getDocumentMask(accountType: AccountType): MaskitoOptions {
  // Máscaras para CPF e CNPJ, definidas com regex para dígitos e pontuação
  if (accountType === "cpf") {
    return {
      overwriteMode: "shift",
      mask: [
        /\d/, /\d/, /\d/, ".",
        /\d/, /\d/, /\d/, ".",
        /\d/, /\d/, /\d/, "-",
        /\d/, /\d/,
      ],
    };
  }

  // CNPJ
  return {
    overwriteMode: "shift",
    mask: [
      /\d/, /\d/, ".",
      /\d/, /\d/, /\d/, ".",
      /\d/, /\d/, /\d/, "/",
      /\d/, /\d/, /\d/, /\d/, "-",
      /\d/, /\d/,
    ],
  };
}

interface MaskedDocumentInputProps extends Omit<any, "onInput" | "value"> {
  accountType: AccountType;
  value: string;
  onValueChange: (newVal: string) => void;
}

export const MaskedDocumentInput = forwardRef<HTMLInputElement, MaskedDocumentInputProps>(
  ({ accountType, value, onValueChange, ...props }, ref) => {
    const maskitoOptions = getDocumentMask(accountType);
    const maskitoRef = useMaskito({ options: maskitoOptions });

    // Dispara sempre que o input mudar (onInput)
    const handleInput = (evt: FormEvent<HTMLInputElement>) => {
      onValueChange(evt.currentTarget.value);
    };

    return (
      <Input
        ref={(node) => {
          // Encaminha a ref para o Maskito + a ref externa
          maskitoRef(node);
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        value={value}
        onInput={handleInput}
        {...props}
      />
    );
  }
);

MaskedDocumentInput.displayName = "MaskedDocumentInput";
