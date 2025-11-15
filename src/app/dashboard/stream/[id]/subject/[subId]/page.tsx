"use client";

import { Fieldset, Stack, Heading, SimpleGrid } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toaster } from "@/src/components/ui/toaster";
import CustomCard from "@/src/components/dashboard/Card";
import FormHeader from "@/src/components/shared/atomic/FormHeader";
import FormInput from "@/src/components/shared/atomic/FormInput";
import FormTextArea from "@/src/components/shared/atomic/FormTextArea";
import FormRemoveImg from "@/src/components/shared/molecular/FormRemoveImg";
import FormUpdateTag from "@/src/components/shared/molecular/FormUpdateTag";
import FormRemoveTag from "@/src/components/shared/molecular/FormRemoveTag";
import ConditionEdit from "@/src/components/shared/molecular/ConditionEdit";
import FormRemovePdf from "@/src/components/shared/molecular/FormRemovePdf";
import FormUploadPdf from "@/src/components/shared/molecular/FormUploadPdf";
import FormUploadImg from "@/src/components/shared/molecular/FormUploadImg";
import FormPopover from "@/src/components/shared/molecular/FormPopover";
import { Types } from "mongoose";
import FormSelect from "@/src/components/shared/atomic/FormSelect";

export default function StreamViewPage() {
  type Topic = {
    _id: string;
    topic: string;
    subject: string;
    stream: string;
    description: string;
    videoContent: string[];
    imageContent: string[];
    pdfContent: string[];
  };
  interface StreamDto {
    _id: string | Types.ObjectId;
    stream: string;
  }
  interface Dto {
    _id: string | Types.ObjectId;
    data: string;
  }
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState<Topic[]>([]);
  const [streams, setStreams] = useState<Dto[]>([]);
  const [stream, setStream] = useState("");
  const [updatedSubject, setUpdatedSubject] = useState("");
  const [description, setDescription] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedStream, setUpdatedStream] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [img, setImg] = useState<string[]>([]);
  const [pdf, setPdf] = useState<string[]>([]);
  const [removedImg, setRemovedImg] = useState<string[]>([]);
  const [removedPdf, setRemovedPdf] = useState<string[]>([]);
  const [removedVideoLinks, setRemovedVideoLinks] = useState<string[]>([]);
  const [newVideoLinks, setNewVideoLinks] = useState<string[]>([]);
  const [uploadedImg, setUploadedImg] = useState<File[]>([]);
  const [uploadedPdf, setUploadedPdf] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const ref = useRef<HTMLButtonElement | null>(null);

  const params = useParams();
  const router = useRouter();
  const { id, subId } = params;

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
    const fetchTopicBySubject = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/topic/subject?id=${subId}`
      );
      const data = response.data;
      setTopic(data);
    };
    const fetchSubject = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/subject/${subId}`
      );
      const data = response.data;
      setStream(data.stream._id);
      setSubject(data.subject);
      setDescription(data.description || "");
      setRemovedVideoLinks(data.videoContent || []);
      setVideoLinks(data.videoContent || []);
      setImg(data.imageContent);
      setPdf(data.pdfContent);
    };
    try {
      fetchSubject();
      fetchTopicBySubject();
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
  }, [subId]);

  const handleChangeImg = (files: FileList | null) => {
    setUploadedImg(Array.from(files ?? []));
  };

  const handleChangePdf = (files: FileList | null) => {
    setUploadedPdf(Array.from(files ?? []));
  };

  const handleRemovePdf = (fileName: string) => {
    setRemovedPdf((prev) => [...prev, fileName]);
    setPdf((prev) => prev.filter((f) => f !== fileName));
  };

  const handleRemoveImg = (fileName: string) => {
    setRemovedImg((prev) => [...prev, fileName]);
    setImg((prev) => prev.filter((f) => f !== fileName));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("updatedSubject", updatedSubject);
    if (!subject.trim()) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Subject name is required.",
      });
      return;
    }
    if (!String(id)) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Stream id is required.",
      });
      return;
    }
    formData.append("existingStream", String(id));
    formData.append("updatedDescription", updatedDescription);
    formData.append("updatedStream", updatedStream);
    formData.append("newVideo", newVideoLinks.join(","));
    formData.append("removedImg", removedImg.join(","));
    formData.append("removedPdf", removedPdf.join(","));
    formData.append("removedVideo", removedVideoLinks.join(","));
    // Append newly uploaded files
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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/subject/${subId}`,
        formData
      );

      if (response.status === 201) {
        toaster.create({
          type: "success",
          title: "Success!",
          description: "Subject updated successfully.",
        });
        setUpdatedSubject("");
        setUpdatedDescription("");
        setUpdatedStream("");
        setNewVideoLinks([]);
        setRemovedImg([]);
        setRemovedPdf([]);
        setRemovedVideoLinks([]);
      } else {
        toaster.create({
          type: "error",
          title: "Failed!",
          description: "An error occurred while updating the subject.",
        });
      }
      router.replace("");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const resErr =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An error occurred while updating the subject.";
      toaster.create({
        type: "error",
        title: "Failed!",
        description: resErr || "An error occurred while updating the subject.",
      });
    }
  };

  return (
    <Stack
      gap={6}
      h="auto"
      boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;"
    >
      <Stack align="center" p={4}>
        <Fieldset.Root size="lg" maxW="md">
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <FormHeader
              legend="View and Edit Subject"
              helperText="Fill in the details below to edit the subject."
            />
            <ConditionEdit
              content="edit mode"
              isEditMode={isEditMode}
              onClick={() => setIsEditMode(!isEditMode)}
            />
          </Stack>
          <Fieldset.Content>
            <FormInput
              value={subject}
              disabled={!isEditMode}
              label="Subject"
              onChange={(e) => {
                setSubject(e.target.value);
                setUpdatedSubject(() => {
                  if (subject !== e.target.value) return e.target.value;
                  return "";
                });
              }}
            />
            <FormTextArea
              label="Subject"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setUpdatedDescription(() => {
                  if (description !== e.target.value) return e.target.value;
                  return "";
                });
              }}
              disabled={!isEditMode}
            />
            {stream && streams[0] && (
              <FormSelect
                disabled={!isEditMode}
                onChange={(newTags) => {
                  setStream(newTags[0]);
                  setUpdatedStream(() => {
                    if (stream !== newTags[0]) return newTags[0];
                    return "";
                  });
                }}
                items={streams}
                defaultValue={stream}
                label="stream"
              />
            )}
            <FormRemoveTag
              isEditMode={isEditMode}
              values={videoLinks}
              onChange={(newTags) => {
                setRemovedVideoLinks((prev) =>
                  prev.filter((item) => !newTags.includes(item))
                );
                setVideoLinks(newTags);
              }}
              label="Remove Existing Youtube Video Links"
            />
            <FormUpdateTag
              values={newVideoLinks}
              isEditMode={isEditMode}
              label="Youtube Video Links"
              onChange={(newTags) => setNewVideoLinks(newTags)}
            />
            <FormRemoveImg
              label="Remove Images"
              img={img}
              isEditMode={isEditMode}
              ref={ref}
              onClick={handleRemoveImg}
            />
            <FormRemovePdf
              onClick={handleRemovePdf}
              label="Remove PDF"
              values={pdf}
              ref={ref}
              isEditMode={isEditMode}
            />
            <FormUploadImg
              label="Upload Images"
              maxFiles={25}
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
              maxFiles={25}
              onChange={(event: React.FormEvent<HTMLDivElement>) => {
                event.preventDefault();
                const input = (event.target as HTMLElement).querySelector(
                  'input[type="file"]'
                ) as HTMLInputElement;
                handleChangePdf(input?.files ?? null);
              }}
            />
          </Fieldset.Content>
          <FormPopover
            isEditMode={isEditMode}
            label="Edit Subject"
            content="Are you sure you want to edit?"
            resolve="Edit"
            reject="Cancel"
            onClick={() => {
              handleUpdate();
            }}
          />
          <Fieldset.HelperText>
            Don&apos;t need an account?{" "}
            <Link href="/dashboard" className="link">
              Back to Dashboard
            </Link>
          </Fieldset.HelperText>
        </Fieldset.Root>
      </Stack>
      <Stack align="center" p={4} gap={6}>
        <Heading>Topics Under the {subject}</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} p={4}>
          {topic.map(
            (
              data: {
                _id: string;
                stream: string;
                subject: string;
                topic: string;
                description: string;
                videoContent: string[];
                imageContent: string[];
                pdfContent: string[];
              },
              idx: number
            ) => (
              <CustomCard
                data={data}
                category={"subject"}
                idx={idx}
                key={data._id}
              />
            )
          )}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
