"use client";

import { Navbar } from "@/components/ui/mini-navbar";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { question, Topic } from "../types";
import axios from "axios";
import QuestionTable from "./table";

export default function Dashboard() {
  const [categoryId, setCategoryId] = useState<string>(
    "64e0e185-9f32-4209-8129-94d63b5f4c06"
  );
  const [openTopicId, setOpenTopicId] = useState<string | null>("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<question[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/topic/${categoryId}`
        );
        setTopics(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTopics();
  }, [categoryId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        topics.forEach(async (topic) => {
          const response = await axios.get(
            `http://localhost:7000/api/question/${topic.id}`
          );
          setQuestions((prev) => [...prev, ...response.data.result]);
          console.log(response.data.result);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, [topics]);
  return (
    <div className="w-full min-h-screen ">
      <Navbar />
      <div className="flex justify-center p-16 mt-10">
        <div className="w-[95%] rounded-[20px] p-6 bg-white/5 border border-white/5 backdrop-blur-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="3"
            onValueChange={(value) => setOpenTopicId(value)}
          >
            {topics.map((topic) => (
              <AccordionItem value={topic.id} key={topic.id} className="py-2">
                <AccordionTrigger className="justify-start gap-3 py-2 text-[15px] leading-6 hover:no-underline [&>svg]:-order-1">
                  {topic.name}
                </AccordionTrigger>
                <AccordionContent className="pb-2 ps-7 text-muted-foreground">
                   <QuestionTable questions={questions} openTopicId = {openTopicId as string} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
