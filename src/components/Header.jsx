import Container from "react-bootstrap/Container"
import Image from 'react-bootstrap/Image'
import reactLogo from "../assets/react.svg"
import logo from "../assets/logo.png"


const Header = () => {
  return <Container>
    <Image fluid src={logo} width="250px"></Image>
  </Container>;
};

export default Header;
