import { Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import axios from "axios";

function AllProduct() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/products")
            .then((response) => {
                setProducts(response.data); 
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            });
    }, []); 

    return (
        <>
            <Row md={3} className="g-4 mt-1">
                {products?.map((sv) => {
                    return (
                        <Col key={sv.id}>
                            <Card className="h-100">
                                <Card.Img variant="top" src={`/images/${sv.photo}`} alt={sv.title} />
                                <Card.Body>
                                    <Card.Title>{sv.title}</Card.Title>
                                    <Card.Text>
                                        <b>Thông số kỹ thuật:</b> {sv.description}
                                    </Card.Text>
                                    <Card.Text>
                                        <b>Giá: </b>
                                        {sv.price}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}

export default AllProduct;