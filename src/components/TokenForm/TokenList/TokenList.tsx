import { StyledToken } from "./styled";
import { mergeStateType, Token } from "../../../types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface TokenListProps {
  activeTokenName: string;
  setTokenOptions: mergeStateType;
  list: Token[];
}

const SwiperStyle = {
  width: "100%",
  height: "100%",
  marginTop: "24px",
  padding: "0px 24px",
};

export const TokenList = ({
  setTokenOptions,
  activeTokenName,
  list,
}: TokenListProps) => {
  return (
    <Swiper
      style={SwiperStyle}
      navigation={true}
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Navigation, Pagination]}
      slidesPerView={7}
      spaceBetween={40}
    >
      {list.map(({ name, image, address }) => {
        const active = name === activeTokenName ? "active" : "";
        return (
          <SwiperSlide key={name}>
            <StyledToken
              className={`token-wrap ${active} ${address ? "" : "coming-soon"}`}
              onClick={
                address ? () => setTokenOptions({ name, image }) : () => {}
              }
            >
              <img src={image} alt={name} />
              <span className="name">{name}</span>
              {!address && <span className="soon">soon 🤫</span>}
            </StyledToken>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
