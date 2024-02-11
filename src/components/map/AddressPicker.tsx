import ApiRoute from "@/util/constant/api_route";
import { RoadAdress } from "@/util/constant/location";
import useGeoLocation from "@/util/hook/useGeoLocation";
import axios from "axios";
import { useEffect, useState } from "react"

interface AddressPickerProps {
    label: string
}

// @TODO
// (ASIS) 현재 위치를 기준으로 도로명 주소를 검색하고, 유저가 주소를 선택할 수 있도록 함
// (ToBE) 유저가 주소를 검색할 수 있도록 함
export default function AddressPicker({ label }: AddressPickerProps) {

    const [address, setAddress] = useState<RoadAdress | null>(null)
    const [candidates, setCandidates] = useState<RoadAdress[]>([])
    const { isLoading, currentLocation } = useGeoLocation()

    const getRoadAddress = async () => {
        setAddress(null)
        if (!currentLocation) {
            setCandidates([])
            console.warn("현재 위치 정보가 없음")
            return
        }
        const endPoint = `${ApiRoute.getRoadAddressFromCoordinate.url}&x=${currentLocation.longitude}&y=${currentLocation.latitude}`
        await axios.get(endPoint).then(res => res.data).then(data => {
            console.log(data.message)
            setCandidates(data.addresses)
        })
    }

    const handleSelectAddress = (selected: RoadAdress) => () => {
        setAddress(selected)
    }

    useEffect(() => {
        const _init = async () => getRoadAddress()
        _init()
    }, [currentLocation])

    if (isLoading) {
        return <div className="w-full justify-center flex">
            <span>Loadings...</span>
        </div>
    }

    return <div>
        <div className="justify-start flex items-center">
            <h3 className="text-xl font-semibold bg-slate-700 rounded-lg px-2 py-1 text-white inline mr-5">{label}</h3>
            {
                address
                    ? <span className="text-slate-800 hover:text-sky-700 text-xl font-bold" onClick={getRoadAddress}>{address.address_name}</span>
                    : <span className="text-slate-500">현재 주소를 설정해주세요</span>
            }

        </div>

        <ul className="my-3">
            {(!address && candidates) && candidates.map((candidate, index) => <li key={index}>
                <button onClick={handleSelectAddress(candidate)} className="bg-slate-500 text-white px-2 py-1 rounded-lg">
                    {candidate.address_name}
                </button>
            </li>)}
        </ul>

    </div>
}