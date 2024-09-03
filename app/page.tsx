"use client";
import Image from "next/image";
import vercel from "../public/bike-svgrepo-com.svg";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Bikes {
  id: number;
  date_stolen: number;
  description: string;
  large_img: string;
  title: string;
  year: number;
  stolen_location: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const abc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [startDate, setStartDate] = useState(abc);
  const rowsPerPage = 10;
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const [data, setData] = useState<Bikes[]>([]);
  const formatDate = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://bikeindex.org:443/api/v3/search?page=${startIndex}&per_page=${rowsPerPage}&location=Munich&distance=10&stolenness=proximity&query=${search}&access_token=eJW36PlqR9EmKWTEm0fm_iTrmL_wEk6FaBg78fIpg48
`
      );
      const newresponse = await axios.get(
        `https://bikeindex.org:443/api/v3/search/count?location=Munich&distance=10&stolenness=stolen&access_token=eJW36PlqR9EmKWTEm0fm_iTrmL_wEk6FaBg78fIpg48
`
      );
      const responseData = response.data.bikes;
      const total = newresponse.data.proximity;
      setData(responseData);
      setTotal(total);
      console.log(data);
      console.log(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [startIndex]);
  return (
    <>
      <div className="min-h-screen">
        <main className="p-4 flex flex-col items-center justify-center w-full ">
          <span className="text-4xl font-bold mt-5">Bikes</span>
          <div className="bg-black text-white font-bold p-5 my-3 rounded-xl  flex flex-col space-y-2 justify-center items-center">
            <p>total number of stolen bikes {total}</p>
            <div className=" flex justify-center items-center">
              <input
                className=" p-4 text-black outline-none rounded-lg"
                type="text"
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <button
            className="bg-black text-white rounded-full p-5"
            onClick={() => getData()}
          >
            search
          </button>

          <div className=" mt-4 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading &&
              Array.isArray(startDate) &&
              startDate.map((id) => (
                <Card
                  key={id}
                  className="flex flex-col justify-between shadow-2xl"
                >
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className=" w-5 h-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="  items-center justify-center flex flex-col">
                    <div className="relative h-40 w-60">
                      <Skeleton className=" h-40 w-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center text-center space-y-1  justify-center ">
                    <Skeleton className="w-14 h-4" />
                    <Skeleton className="w-14 h-4" />
                    <Skeleton className="w-14 h-4" />
                  </CardFooter>
                </Card>
              ))}
          </div>
          <div className=" mt-4 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {!loading &&
              data &&
              data.length > 0 &&
              data.map((bike) => (
                <Card
                  key={bike.id}
                  className="flex flex-col justify-between shadow-2xl"
                >
                  <CardHeader>
                    <CardTitle>{bike.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="  items-center justify-center flex flex-col">
                    <div className="relative h-40 w-full">
                      {bike.large_img ? (
                        <Image
                          src={bike.large_img}
                          alt={bike.title}
                          fill
                          className=" rounded-md"
                        />
                      ) : (
                        <Image
                          src={vercel}
                          alt={bike.title}
                          fill
                          className=" rounded-md"
                        />
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center text-center  justify-center ">
                    <p className=" text-red-600">
                      Theft Date:{formatDate(bike.date_stolen)}
                    </p>
                    <p className="text-blue-600">Reported Date:{bike.year} </p>
                    <p>Location: {bike.stolen_location}</p>
                    <CardDescription className=" text-sm font-medium p-2 text-center">
                      {bike.description}
                    </CardDescription>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </main>
      </div>
      <Pagination className="">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                startIndex === 1 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={() => {
                setStartIndex(startIndex - 1);
                setEndIndex(endIndex - 10);
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              className={
                endIndex > 31 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={() => {
                setStartIndex(startIndex + 1); //10
                setEndIndex(endIndex + 10);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <footer className="p-4 text-white text-sm sm:text-lg bg-black flex justify-center items-center  w-full">
        {" "}
        &copy; 2024 <span className=" p-1 font-bold">Bikes </span>All right
        reserved
      </footer>
    </>
  );
}
