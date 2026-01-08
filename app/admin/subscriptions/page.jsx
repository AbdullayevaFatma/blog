"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/Components/ui/table";
import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";

const Page = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/email");
      setEmails(response.data.emails || []);
    } catch (error) {
      console.error("Fetch emails error:", error);
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmail = async (mongoId) => {
    if (!confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    try {
      const response = await api.delete("/email", {
        params: { id: mongoId },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchEmails();
      }
    } catch (error) {
      console.error("Delete email error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete subscription",
      );
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  if (loading) {
    return (
      <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
        <div className="flex justify-center items-center min-h-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-2xl font-bold mb-6">All Subscriptions</h1>

      <div className="overflow-x-auto border rounded-lg py-4">
        <Table>
          <TableCaption>
            {emails.length === 0
              ? ""
              : "All email subscriptions"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-base sm:text-lg">
                Email Subscription
              </TableHead>
              <TableHead className="hidden sm:table-cell font-bold text-base sm:text-lg">
                Date
              </TableHead>
              <TableHead className="font-bold text-base sm:text-lg">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-zinc-400">
                  No subscriptions yet
                </TableCell>
              </TableRow>
            ) : (
              emails.map((email) => (
                <TableRow key={email._id}>
                  <TableCell className="font-medium">{email.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(email.date).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteEmail(email._id)}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {emails.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-base font-bold">
                  Total Subscriptions: {emails.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
};

export default Page;
