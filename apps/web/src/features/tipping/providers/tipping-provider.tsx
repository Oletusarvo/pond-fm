import { useState } from "react";

import { setupContext } from "../../../utils/setup-context";
import { Modal } from "../../../components/modal";
import { Button, LoaderButton } from "../../../components/button";
import { Coins } from "lucide-react";
import { v4 } from "uuid";
import { useStatus } from "../../../hooks/use-status";
import { api } from "../../../utils/api/api";
import { TAuthor } from "@pondfm/app-shared/dist/types/author";

const amounts = [
  { amount: 2, id: v4() },
  { amount: 5, id: v4() },
  { amount: 10, id: v4() },
];

const [TippingContext, useTippingContext] = setupContext<{
  //tip: (amountInCents: number) => Promise<void>;
  showTippingModal: () => void;
}>({ name: "TippingContext" });

type TippingProviderProps = React.PropsWithChildren & {
  recipient: TAuthor;
};

/**Provides logic and a modal for giving tips to authors. */
export function TippingProvider({ children, recipient }: TippingProviderProps) {
  const { status, loading, setStatus } = useStatus();
  const [selectedAmount, setSelectedAmount] = useState(() => amounts.at(1));
  const amount = selectedAmount.amount;

  const [showModal, setShowModal] = useState(false);

  const showTippingModal = () => {
    setShowModal(true);
  };

  const tip = async () => {
    setStatus("loading");

    try {
      const res = await api.users.tip({
        recipientId: recipient.audius_user_id,
        amountInCents: amount * 100,
      });
      setStatus("success");
      setShowModal(false);
      return res;
    } catch (err) {
      setStatus("error");
      console.log(err.message);
    }
  };

  const platformFeePercentage = 0.05;
  const platformFeeAmount =
    typeof amount !== "undefined" ? Math.round(amount * platformFeePercentage * 100) / 100 : 0;
  const vat = Math.round(amount * 0.255 * 100) / 100;
  const totalTip = amount;

  return (
    <TippingContext.Provider value={{ showTippingModal }}>
      {children}
      {showModal ? (
        <Modal title='Tip User' onClose={() => setShowModal(false)}>
          <div className='flex flex-col w-full gap-8 items-center'>
            <Coins size='3rem' color='var(--color-primary)' />
            <table className='w-full'>
              <tbody>
                <tr>
                  <td>Recipient</td>
                  <td className='text-right'>{recipient.username}</td>
                </tr>
                <tr className='bg-slate-500/20'>
                  <td>Amount</td>
                  <td className='text-right'>{amount}€</td>
                </tr>

                <tr className='border-slate-400'>
                  <td>VAT (25,5%)</td>
                  <td className='text-right'>{vat}€</td>
                </tr>
              </tbody>
            </table>
            <table className='w-full'>
              <tbody>
                <tr className='py-8'>
                  <td className='text-xl'>Artist Receives</td>
                  <td className='text-right text-xl'>{totalTip}€</td>
                </tr>
                <tr className='py-8'>
                  <td className='text-xl'>Total</td>
                  <td className='text-right text-xl'>{totalTip + vat}€</td>
                </tr>
              </tbody>
            </table>
            <AmountSelector
              onAmountSelected={(a) => setSelectedAmount(a)}
              selectedAmount={selectedAmount}
            />
            <div className='flex gap-4 w-full'>
              <Button
                disabled={loading || status === "success"}
                shape='rounded'
                paddingEnabled
                onClick={() => setShowModal(false)}
                variant='outlined'
                fullWidth
              >
                Cancel
              </Button>
              <LoaderButton
                disabled={loading || status === "success"}
                loading={loading}
                shape='rounded'
                paddingEnabled
                onClick={tip}
                variant='contained'
                fullWidth
              >
                <Coins size='1rem' />
                Tip {totalTip + vat}€
              </LoaderButton>
            </div>
          </div>
        </Modal>
      ) : null}
    </TippingContext.Provider>
  );
}

function AmountSelector({ onAmountSelected, selectedAmount }) {
  return (
    <div className='flex gap-4 items-center w-[70%]'>
      {amounts.map((a, i) => {
        return (
          <Button
            paddingEnabled
            fullWidth
            key={i}
            onClick={() => {
              onAmountSelected(a);
            }}
            shape='rounded'
            variant={selectedAmount?.id === a?.id ? "contained" : "outlined"}
          >
            {a.amount}€
          </Button>
        );
      })}
    </div>
  );
}

export { useTippingContext };
