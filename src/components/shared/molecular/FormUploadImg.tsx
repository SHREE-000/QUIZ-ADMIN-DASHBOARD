"use client";
import {
  Button,
  Field,
  FileUpload,
  Float,
  HStack,
  useFileUploadContext,
} from "@chakra-ui/react";
import { LuFileImage, LuX } from "react-icons/lu";

const FormUploadImg = ({
  maxFiles = 25,
  label,
  onChange,
}: {
  label: string;
  maxFiles?: number;
  onChange: (e: React.FormEvent<HTMLDivElement>) => void;
}) => {
  const FileUploadList = () => {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;
    if (files.length === 0) return null;

    return (
      <FileUpload.ItemGroup>
        <HStack gap={6} wrap="wrap">
          {files.map((file) => (
            <FileUpload.Item
              w="auto"
              boxSize="20"
              p="2"
              file={file}
              key={file.name}
            >
              <FileUpload.ItemPreviewImage />
              <Float placement="top-end">
                <FileUpload.ItemDeleteTrigger
                  boxSize="4"
                  layerStyle="fill.solid"
                >
                  <LuX />
                </FileUpload.ItemDeleteTrigger>
              </Float>
            </FileUpload.Item>
          ))}
        </HStack>
      </FileUpload.ItemGroup>
    );
  };

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <FileUpload.Root accept="image/*" maxFiles={maxFiles} onChange={onChange}>
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button variant="outline" size="sm" w="100%">
            <LuFileImage /> {label}
          </Button>
        </FileUpload.Trigger>
        <FileUploadList />
      </FileUpload.Root>
    </Field.Root>
  );
};

export default FormUploadImg;
