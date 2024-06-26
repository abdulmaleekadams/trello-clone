"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hoooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CradWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Header from "./header";

const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const {data: cardData} = useQuery<CradWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {
          !cardData ? <Header.Skeleton />
         : <Header  data={cardData} />
        }
        {cardData?.title}</DialogContent>
    </Dialog>
  );
};

export default CardModal;
