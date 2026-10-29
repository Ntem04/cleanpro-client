import BureauxImg from "../../../../image/services-bureaux0.webp";
import ResidencesImg from "../../../../image/services-residences.webp";
import IndustriesImg from "../../../../image/industriesImage.webp";
import PublicsImg from "../../../../image/services-publics.webp";

export const SERVICE_IMAGES: Record<string, string> = {
  "services-bureaux0": BureauxImg,
  "services-residences": ResidencesImg,
  "industriesImage": IndustriesImg,
  "services-publics": PublicsImg,
  bureaux: BureauxImg,
  residences: ResidencesImg,
  industries: IndustriesImg,
  "espaces-publics": PublicsImg,
};

export function getServiceImage(key: string): string {
  return SERVICE_IMAGES[key] ?? BureauxImg;
}

