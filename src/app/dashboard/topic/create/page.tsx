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
import { Types } from "mongoose";
import FormSelect from "@/src/components/shared/atomic/FormSelect";

export default function TopicCreatePage() {
  interface Dto {
    _id: string | Types.ObjectId;
    stream: string;
    subject: string;
  }
  interface DataDto {
    _id: string | Types.ObjectId;
    data: string;
  }
  const [stream, setStream] = useState<string>("");
  const [streams, setStreams] = useState<DataDto[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [subjects, setSubjects] = useState<DataDto[]>([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImg, setUploadedImg] = useState<File[]>([]);
  const [uploadedPdf, setUploadedPdf] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);

  useEffect(() => {
    const fetchStream = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/stream`);
      const data = response.data;
      const streamData = data.flatMap((stream: Dto) => [
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
    const fetchStream = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/subject/stream?id=${stream}`
      );
      const data = response.data;
      const subjectData = data.flatMap((subject: Dto) => [
        { _id: subject._id, data: subject.subject },
      ]);
      setSubjects(subjectData);
    };
    try {
      if (stream.trim()) fetchStream();
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
    if (!topic.trim()) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Topic name is required.",
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

      if (response.status === 200) {
        setVideoLinks([]);
        setUploadedPdf([]);
        setUploadedImg([]);
        setSubjects([]);
        setDescription("");
        setStream("");
        setTopic("");
        setSubject("");
        toaster.create({
          type: "success",
          title: "Success!",
          description: "Topic created successfully.",
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const resErr =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An error occurred while creating the topic.";
      toaster.create({
        type: "error",
        title: "Failed!",
        description: resErr || "An error occurred while creating the topic.",
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
          <FormInput value={topic} label="Topic" onChange={(e) => setTopic(e.target.value)} />
          <FormTextArea
            value={description}
            label="topic"
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormSelect
            onChange={(newTags) => setStream(newTags[0])}
            items={streams}
            label="stream"
          />
          {stream && subjects[0] && (
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
          disabled={[stream, subject, topic].some((v) => !v.trim())}
          label="Create Subject"
          link="/dashboard"
          onClick={handleCreate}
          helperText={"Don't need to create? "}
          linkText="Back to Dashboard"
        />
      </Fieldset.Root>
    </Stack>
  );
}
