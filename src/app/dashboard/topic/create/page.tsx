"use client";

import { Fieldset, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toaster } from "@/src/components/ui/toaster";
import FormHeader from "@/src/components/shared/atomic/FormHeader";
import FormInput from "@/src/components/shared/atomic/FormInput";
import FormTextArea from "@/src/components/shared/atomic/FormTextArea";
import FormTags from "@/src/components/shared/atomic/FormTags";
import FormUploadImg from "@/src/components/shared/molecular/FormUploadImg";
import FormUploadPdf from "@/src/components/shared/molecular/FormUploadPdf";
import ButtonWithBackLink from "@/src/components/shared/atomic/ButtonWithBackLink";
import FormSelect from "@/src/components/shared/molecular/FormSelect";
import { CategoryDto, StreamDto, SubDto } from "@/src/utils/interface";

export default function SubjectCreatePage() {
  const [topic, setTopic] = useState("");
  const [stream, setStream] = useState<string>("");
  const [streams, setStreams] = useState<CategoryDto[]>([]);
  const [subjects, setSubjects] = useState<CategoryDto[]>([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImg, setUploadedImg] = useState<File[]>([]);
  const [uploadedPdf, setUploadedPdf] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);

  useEffect(() => {
    const fetchStream = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/stream`);
      const data = response.data;
      const streamData = data.flatMap((stream: StreamDto) => [
        { _id: stream._id, data: stream.stream },
      ]);
      setStreams(streamData);
    };
    try {
      fetchStream();
    } catch (error: unknown) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while fetch the the stream.",
      });
    }
  }, []);

  useEffect(() => {
    const fetchSubject = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/subject/stream?id=${stream}`
      );
      const data = response.data;
      const streamData = data.flatMap((subject: SubDto) => [
        { _id: subject._id, data: subject.subject },
      ]);
      setSubjects(streamData);
    };
    try {
      if (stream) fetchSubject();
    } catch (error: unknown) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while fetch the the subject.",
      });
    }
  }, [stream]);

  const handleChangeImg = (files: FileList | null) => {
    setUploadedImg(Array.from(files ?? []));
  };

  const handleChangePdf = (files: FileList | null) => {
    setUploadedPdf(Array.from(files ?? []));
  };

  const handleCreate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("subject", subject);
    formData.append("stream", stream);
    if (!subject.trim()) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Subject name is required.",
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
        `${process.env.NEXT_PUBLIC_API}/topic`,
        formData
      );
      if (response.status === 201) {
        setVideoLinks([]);
        setUploadedPdf([]);
        setUploadedImg([]);
        setSubjects([]);
        setDescription("");
        setStream("");
        setSubject("");
        toaster.create({
          type: "success",
          title: "Success!",
          description: "Subject created successfully.",
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const resErr =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An error occurred while creating the subject.";
      toaster.create({
        type: "error",
        title: "Failed!",
        description: resErr || "An error occurred while creating the subject.",
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
          legend="Create a New Topic"
          helperText="Fill in the details below to create a new topic."
        />
        <Fieldset.Content>
          <FormInput
            value={topic}
            label="Topic"
            onChange={(e) => setTopic(e.target.value)}
          />
          <FormTextArea
            value={description}
            label="topic"
            onChange={(e) => setDescription(e.target.value)}
          />
          {streams[0] && (
            <FormSelect
              onChange={(newTags) => setStream(newTags[0])}
              items={streams}
              label="stream"
            />
          )}
          {streams[0] && subjects[0] && (
            <FormSelect
              onChange={(newTags) => setSubject(newTags[0])}
              items={subjects}
              label="subject"
            />
          )}
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
          disabled={[topic, stream, subject].some((v) => !v.trim())}
          label="Create Topic"
          link="/dashboard"
          onClick={handleCreate}
          helperText={"Don't need to create? "}
          linkText="Back to Dashboard"
        />
      </Fieldset.Root>
    </Stack>
  );
}
