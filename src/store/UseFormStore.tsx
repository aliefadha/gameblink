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
        unit_id: string,
        jam_main: string,
        harga: number,
    }[]
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


const useFormStore = create<{
    stepOne: StepOneData | null;
    stepTwo: StepTwoData | null;
    stepThree: StepThreeData | null;
    setData: ({ step, data }: setDataType) => void;
}>(
    devtools((set) => ({
        stepOne: null,
        stepTwo: null,
        stepThree: null,
        setData: ({ step, data }) =>
            set((state) => ({
                ...state,
                [stepVariant[step]]: data,
            })),
    }))
);

export default useFormStore;
