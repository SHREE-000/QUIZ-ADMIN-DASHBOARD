"use client";

import {
  Fieldset,
  Stack,
  Heading,
  SimpleGrid,
  CloseButton,
} from "@chakra-ui/react";
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
import FormSelect from "@/src/components/shared/molecular/FormSelect";
import { CategoryDto, Qn, StreamDto, SubDto } from "@/src/utils/interface";
import BackwardLink from "@/src/components/shared/atomic/BackwardLink";
import Spin from "@/src/components/shared/atomic/Spinner";

export default function StreamViewPage() {
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState<CategoryDto[]>([]);
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Qn[]>([]);
  const [streams, setStreams] = useState<CategoryDto[]>([]);
  const [stream, setStream] = useState("");
  const [updatedSubject, setUpdatedSubject] = useState("");
  const [updatedTopic, setUpdatedTopic] = useState("");
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
  const [aiBatchs, setAiBatchs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const params = useParams();
  const router = useRouter();
  const { id, subId, topicId } = params;

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
      const subjectData = data.flatMap((subject: SubDto) => [
        { _id: subject._id, data: subject.subject },
      ]);
      setSubjects(subjectData);
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

  useEffect(() => {
    const fetchQnByTopic = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/question/topic?id=${topicId}`
      );
      const data = response.data;
      setQuestions(data);
    };
    const fetchTopic = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/topic/${topicId}`
      );
      const data = response.data;
      setTopic(data.topic);
      setStream(data.stream._id);
      setSubject(data.subject._id);
      setDescription(data.description || "");
      setRemovedVideoLinks(data.videoContent || []);
      setVideoLinks(data.videoContent || []);
      setImg(data.imageContent);
      setPdf(data.pdfContent);
      setAiBatchs(
        data.qnBatchData?.map((batch: { batchId: string }) => batch.batchId) ||
          []
      );
    };
    try {
      fetchTopic();
      fetchQnByTopic();
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
  }, [topicId]);

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
    formData.append("updatedTopic", updatedTopic);
    if (!topic.trim()) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Topic name is required.",
      });
      return;
    }
    if (!String(id) || !String(subId) || !String(topicId)) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Stream id, Subject id and Topic id is required.",
      });
      return;
    }
    formData.append("existingStream", String(id));
    formData.append("existingSubject", String(subId));
    formData.append("updatedDescription", updatedDescription);
    formData.append("updatedStream", updatedStream);
    formData.append("updatedSubject", updatedSubject);
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
        `${process.env.NEXT_PUBLIC_API}/topic/${topicId}`,
        formData
      );

      if (response.status === 200) {
        toaster.create({
          type: "success",
          title: "Success!",
          description: "Topic updated successfully.",
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
          description: "An error occurred while updating the topic.",
        });
      }
      router.replace("");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const resErr =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An error occurred while updating the topic.";
      toaster.create({
        type: "error",
        title: "Failed!",
        description: resErr || "An error occurred while updating the subject.",
      });
    }
  };

  const handleRunAiBatch = async (batchId: string) => {
    try {
      setLoading(true);
      const userString = sessionStorage.getItem("user");
      const { _id } = userString ? JSON.parse(userString) : { _id: "" };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/topic/${topicId}`,
        { batchId, userId: _id }
      );
      setLoading(false);
      if (response.status === 201) {
        toaster.create({
          type: "success",
          title: "Success!",
          description: "AI Batch executed successfully.",
        });
      } else if (response.status === 400) {
        toaster.create({
          type: "info",
          title: "No Resolved!",
          description: response.data.error || "Batch may not resolve yet.",
        });
      } else {
        toaster.create({
          type: "error",
          title: "Failed!",
          description: "An error occurred while executing the AI batch.",
        });
      }
    } catch (error: unknown) {
      setLoading(false);
      const axiosError = error as AxiosError<{ error?: string }>;
      const resErr =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An error occurred while executing the AI batch.";
      toaster.create({
        type: "error",
        title: "Failed!",
        description:
          resErr || "An error occurred while executing the AI batch.",
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
              value={topic}
              disabled={!isEditMode}
              label="Topic"
              onChange={(e) => {
                setTopic(e.target.value);
                setUpdatedTopic(() => {
                  if (topic !== e.target.value) return e.target.value;
                  return "";
                });
              }}
            />
            <FormTextArea
              label="Topic"
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
            {subject && subjects[0] && (
              <FormSelect
                disabled={!isEditMode}
                onChange={(newTags) => {
                  setSubject(newTags[0]);
                  setUpdatedSubject(() => {
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
            <>
              <h1>AI Batch IDs</h1>
              {aiBatchs.map((batch, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ whiteSpace: "pre-line" }}>{batch}</div>{" "}
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRunAiBatch(batch)}
                  >
                    Run
                  </button>
                </div>
              ))}
            </>
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
          <BackwardLink
            label="Don't need to create topic?"
            link="/dashboard"
            linkText="Back to Dashboard"
          />
        </Fieldset.Root>
      </Stack>
      {loading && <Spin />}
    </Stack>
  );
}
