"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { question } from "../types";
import { Plus, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

type Difficulty = "easy" | "medium" | "hard";

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-green-800 text-green-400 px-12",
  medium: "bg-yellow-800 text-yellow-400 px-9",
  hard: "bg-red-700 text-red-300 px-12",
};

export default function QuestionTable({
  questions,
  openTopicId,
}: {
  questions: question[];
  openTopicId: string;
}) {
  return (
    <div className="">
      <div className="overflow-hidden rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="items-center">
              <TableHead className="h-9 py-2 text-white">Completed</TableHead>
              <TableHead className="h-9 py-2 text-white">Problem</TableHead>
              <TableHead className="h-9 py-2 text-white justify-center flex">
                Go to
              </TableHead>
              <TableHead className="h-9 py-2 text-white">Note</TableHead>
              <TableHead className="h-9 py-2 text-white justify-center flex">
                Difficulty
              </TableHead>
              <TableHead className="h-9 py-2 text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="items-center">
            {questions.filter((q)=> q.topicId === openTopicId).map((question: question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium ml-5">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 accent-gray-600 rounded cursor-pointer"
                  />
                </TableCell>

                <TableCell className="py-2 text-white">
                  {question.title}
                </TableCell>
                <TableCell className="py-2 justify-center flex">
                  <Link
                    href={question.problemLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SquareArrowOutUpRight className="w-4 h-4 mt-2 text-blue-600 hover:text-blue-800 transition-colors" />
                  </Link>
                </TableCell>
                <TableCell className="py-2">
                  <Plus className="text-white" />
                </TableCell>
                <TableCell className="py-2 justify-center flex">
                  <p
                    className={`${
                      difficultyStyles[question.difficulty]
                    } rounded-4xl py-1`}
                  >
                    {question.difficulty.charAt(0).toUpperCase() +
                      question.difficulty.slice(1)}
                  </p>
                </TableCell>

                {/* <TableCell className="py-2">{language.extension}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
