"use client";
import CardNFT from "@/components/CardNFT";
import HeaderFilterSearchPage from "@/components/HeaderFilterSearchPage";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import Input from "@/shared/Input/Input";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import Loading from "../loading";
import { NftType } from "@/types/Nft";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const PageSearch = ({}) => {
  const userId = Cookies.get("userId");
  const [search, setSearch] = useState("");
  const [nft, setNft] = useState<NftType[]>([]);

  const { isLoading } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiBaseUrl}/nfts/getAll`);
      setNft(data.result);
      return data.result;
    },
  });
  if (isLoading) <Loading />;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredNfts = nft.filter((nft: NftType) =>
    [nft.name, nft.description, nft.current_owner].some((val) =>
      val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className={`nc-PageSearch `}>
      <div
        className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 `}
      />
      <div className="container">
        <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
          <form
            className="relative w-full"
            method="post"
            onSubmit={(e) => e.preventDefault()}
          >
            <label
              htmlFor="search-input"
              className="text-neutral-500 dark:text-neutral-300"
            >
              <span className="sr-only">Search all icons</span>
              <Input
                className="shadow-lg border-0 bg-white dark:!bg-neutral-800"
                id="search-input"
                type="search"
                placeholder="Type your keywords"
                sizeClass="pl-14 py-5 pr-5 md:pl-16"
                rounded="rounded-full"
                value={search}
                onChange={handleSearch}
              />

              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 22L20 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <ButtonCircle
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                size=" w-11 h-11"
                type="submit"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </ButtonCircle>
            </label>
          </form>
        </header>
      </div>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>
          {/* FILTER */}
          <HeaderFilterSearchPage />

          {/* LOOP ITEMS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
            {filteredNfts.map((nft, index) => (
              <CardNFT
                key={nft.id}
                id={nft.id}
                imageUrl={nft.image_url}
                name={nft.name}
                price={nft.price}
                currentOwner={nft.current_owner}
                onSale={nft.on_sale}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {/* <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <Pagination />
            <ButtonPrimary loading>Show me more</ButtonPrimary>
          </div> */}
        </main>

        {/* === SECTION 5 === */}
        {/* <div className="relative py-16 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections />
        </div> */}

        {/* SUBCRIBES */}
        {/* <SectionBecomeAnAuthor /> */}
      </div>
    </div>
  );
};

export default PageSearch;
