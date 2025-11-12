"use client";
import {
  Button,
  Field,
  FileUpload,
} from "@chakra-ui/react";
import { LuFileUp } from "react-icons/lu";

const FormUploadPdf = ({
  maxFiles = 25,
  label,
  onChange,
}: {
  label: string;
  maxFiles?: number;
  onChange: (e: React.FormEvent<HTMLDivElement>) => void;
}) => {

  return (
 <Field.Root>
            <FileUpload.Root
              accept="application/pdf"
              maxFiles={maxFiles}
              onChange={onChange}
            >
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm" w="100%">
                  <LuFileUp /> {label}
                </Button>
              </FileUpload.Trigger>
              <FileUpload.List showSize clearable />
            </FileUpload.Root>
          </Field.Root>
  );
};

export default FormUploadPdf;
