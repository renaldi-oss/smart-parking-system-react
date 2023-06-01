import Container from "react-bootstrap/Container"
import {parkingData} from "../helpers/data"
import Parking from "./Parking";


const Card = () => {
  return (
    <Container className="rounded-4 mt-4 p-4" style={{background: "#c2c2d9"}}>
    <h3 className="text-black my-2">Area Parkir</h3>
    <Parking parkingData={parkingData} />
    </Container>
  )
};

export default Card;
