import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


export type StepOneData = {
    nama: string,
    email: string,
    noHp: string
}

export type StepTwoData = {
    id_cabang: string,
    nama_cabang: string
}

export type StepThreeData = {
    tanggal_main: string,
    total_harga: number,
    booking_detail: {
        nama_unit: string,
        jenis_konsol: string,
        unit_id: string,
        jam_main: string,
        harga: number,
        tanggal: string,
    }[],
    booking_type: string,
    metode_pembayaran: string
}



type setDataType =
    | { step: 1; data: StepOneData }
    | { step: 2; data: StepTwoData }
    | { step: 3; data: StepThreeData }

const stepVariant = {
    1: 'stepOne',
    2: 'stepTwo',
    3: 'stepThree',
};

interface FormStore {
    stepOne: StepOneData | null;
    stepTwo: StepTwoData | null;
    stepThree: StepThreeData | null;
    setData: ({ step, data }: setDataType) => void;
    clearForm: () => void;
}

const useFormStore = create<FormStore>()(
    devtools((set) => ({
        stepOne: null,
        stepTwo: null,
        stepThree: null,
        setData: ({ step, data }) =>
            set((state) => ({
                ...state,
                [stepVariant[step]]: data,
            })),
        clearForm: () =>
            set({
                stepOne: null,
                stepTwo: null,
                stepThree: null,
            }),
    }))
);

export default useFormStore;
