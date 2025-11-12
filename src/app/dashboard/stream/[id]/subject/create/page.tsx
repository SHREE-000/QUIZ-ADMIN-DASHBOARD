"use client";

import {
  Button,
  Field,
  Fieldset,
  FileUpload,
  Float,
  Input,
  Span,
  Stack,
  TagsInput,
  Textarea,
  useFileUploadContext,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import "../../../style.css";
import axios from "axios";
import { LuFileImage, LuFileUp, LuX } from "react-icons/lu";
import { toaster } from "@/src/components/ui/toaster";

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
              <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                <LuX />
              </FileUpload.ItemDeleteTrigger>
            </Float>
          </FileUpload.Item>
        ))}
      </HStack>
    </FileUpload.ItemGroup>
  );
};

export default function StreamCreatePage() {
  const [stream, setStream] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImg, setUploadedImg] = useState<File[]>([]);
  const [uploadedPdf, setUploadedPdf] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);

  const handleChangeImg = (files: FileList | null) => {
    setUploadedImg(Array.from(files ?? []));
  };

  const handleChangePdf = (files: FileList | null) => {
    setUploadedPdf(Array.from(files ?? []));
  };

  const handleCreate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("stream", stream);
    if (!stream.trim()) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Stream name is required.",
      });
      return;
    }
    formData.append("description", description);
    formData.append("video", videoLinks.join(","));
    // Filter out duplicates
    [
      ...new Map(
        Array.from(uploadedImg).map((item) => [item.name, item])
      ).values(),
    ].forEach((file) => {
      formData.append("img", file);
    });

    [
      ...new Map(
        Array.from(uploadedPdf).map((item) => [item.name, item])
      ).values(),
    ].forEach((file) => {
      formData.append("pdf", file);
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/stream`,
        formData
      );

      if (response.status === 200) {
        toaster.create({
          type: "success",
          title: "Success!",
          description: "Stream created successfully.",
        });
      }
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "An error occurred while creating the stream.",
      });
    }
  };

  return (
    <Stack
      align="center"
      p={4}
      gap={6}
      h="lvh"
      boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;"
    >
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>Create a New Stream</Fieldset.Legend>
          <Fieldset.HelperText>
            Fill in the details below to create a new stream.
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Stream</Field.Label>
            <Input
              onChange={(e) => setStream(e.target.value)}
              name="stream"
              type="text"
              placeholder="Enter stream name"
              required
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Textarea
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              placeholder="Enter stream description"
            />
          </Field.Root>

          <Field.Root>
            <TagsInput.Root
              //   value={videoLinks}
              onValueChange={(newTags) => setVideoLinks(newTags.value)}
            >
              <TagsInput.Label>Youtube Video Links</TagsInput.Label>
              <TagsInput.Control>
                <TagsInput.Items />
                <TagsInput.Input placeholder="Add Youtube video link..." />
              </TagsInput.Control>
              <Span textStyle="xs" color="fg.muted" ms="auto">
                Press Enter or Return to add Youtube Video Links
              </Span>
            </TagsInput.Root>
          </Field.Root>

          <Field.Root>
            <FileUpload.Root
              accept="image/*"
              maxFiles={25}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                handleChangeImg(event.target.files);
              }}
            >
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm" w="100%">
                  <LuFileImage /> Upload Images
                </Button>
              </FileUpload.Trigger>
              <FileUploadList />
            </FileUpload.Root>
          </Field.Root>

          <Field.Root>
            <FileUpload.Root
              accept="application/pdf"
              maxFiles={25}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                handleChangePdf(event.target.files);
              }}
            >
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm" w="100%">
                  <LuFileUp /> Upload PDF
                </Button>
              </FileUpload.Trigger>
              <FileUpload.List showSize clearable />
            </FileUpload.Root>
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" onClick={handleCreate}>
          Create Stream
        </Button>
        <Fieldset.HelperText>
          Don&apos;t need an account?{" "}
          <Link href="/dashboard" className="link">
            Back to Dashboard
          </Link>
        </Fieldset.HelperText>
      </Fieldset.Root>
    </Stack>
  );
}
