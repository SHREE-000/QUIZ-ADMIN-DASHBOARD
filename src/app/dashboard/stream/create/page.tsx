"use client";

import { Fieldset, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import "../../../style.css";
import axios, { AxiosError } from "axios";
import { toaster } from "@/src/components/ui/toaster";
import FormHeader from "@/src/components/shared/atomic/FormHeader";
import FormInput from "@/src/components/shared/atomic/FormInput";
import FormTextArea from "@/src/components/shared/atomic/FormTextArea";
import FormTags from "@/src/components/shared/atomic/FormTags";
import FormUploadImg from "@/src/components/shared/molecular/FormUploadImg";
import FormUploadPdf from "@/src/components/shared/molecular/FormUploadPdf";
import ButtonWithBackLink from "@/src/components/shared/atomic/ButtonWithBackLink";

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

      if (response.status === 201) {
        setStream("");
        setDescription("");
        setUploadedPdf([]);
        setVideoLinks([]);
        setUploadedImg([]);
        toaster.create({
          type: "success",
          title: "Success!",
          description: "Stream created successfully.",
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const resErr =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An error occurred while creating the stream.";
      toaster.create({
        type: "error",
        title: "Failed!",
        description: resErr || "An error occurred while creating the stream.",
      });
    }
  };

  return (
    <Stack
      align="center"
      p={4}
      gap={6}
      h="auto"
      boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;"
    >
      <Fieldset.Root size="lg" maxW="md">
        <FormHeader
          legend="Create a New Stream"
          helperText="Fill in the details below to create a new stream."
        />
        <Fieldset.Content>
          <FormInput
            label="Stream"
            onChange={(e) => setStream(e.target.value)}
          />
          <FormTextArea
            label="stream"
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormTags
            label="Youtube Video Links"
            onChange={(newTags) => setVideoLinks(newTags)}
          />
          <FormUploadImg
            label="Upload Images"
            onChange={(event: React.FormEvent<HTMLDivElement>) => {
              event.preventDefault();
              const input = (event.target as HTMLElement).querySelector(
                'input[type="file"]'
              ) as HTMLInputElement;
              handleChangeImg(input?.files ?? null);
            }}
          />
          <FormUploadPdf
            label="Upload PDF"
            onChange={(event: React.FormEvent<HTMLDivElement>) => {
              event.preventDefault();
              const input = (event.target as HTMLElement).querySelector(
                'input[type="file"]'
              ) as HTMLInputElement;
              handleChangePdf(input?.files ?? null);
            }}
          />
        </Fieldset.Content>
        <ButtonWithBackLink
          disabled={stream.trim() ? true : false}
          label="Create Stream"
          link="/dashboard"
          onClick={handleCreate}
          helperText={"Don't need to create? "}
          linkText="Back to Dashboard"
        />
      </Fieldset.Root>
    </Stack>
  );
}
