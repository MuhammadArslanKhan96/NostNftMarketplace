"use client";
import CollectionCard from "@/components/CollectionCard";
import { useUserContext } from "@/hooks/useUserContext";
import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
interface collection {
  id: string;
  name: string;
  description: string;
  price: string;
  current_owner: string;
}
const MyCollectionPage = ({}) => {
  const collectionRouter = useRouter();
  const { user } = useUserContext();
  const userId = Cookies.get("userId");
  const [collections, setCollections] = useState<collection[]>([]);
  const [row, setRows] = useState<number | null>(null);
  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/collection/get/${userId}`, {
        headers: {
          Accept: "application/json",
          // Authorization: `Bearer ${loginToken}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCollections(res.data.result);
        setRows(res.data.result.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={`nc-MyCollectionPage`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          {row == 0 ? (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:tex  t-4xl font-semibold">
                  No Nfts collection found
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  Create a new NFT collection.
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Your NFTs Collection
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  You can see, update, disable and manage your nft collections
                  here.
                </span>
              </div>
              <div className="flex overflow-auto py-2 space-x-4 customScrollBar"></div>
              <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-10  mt-8 lg:mt-10">
                {collections.map((collection, index) => (
                  <CollectionCard
                    key={collection.id}
                    id={collection.id}
                    name={collection.name}
                    description={collection.description}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MyCollectionPage), { ssr: false });
