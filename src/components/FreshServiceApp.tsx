/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Form,
  InputGroup,
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

interface CustomObject {
  id: number;
  name: string;
  description: string;
}

const FreshServiceApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<CustomObject[]>([]);
  const [filteredData, setFilteredData] = useState<CustomObject[]>([]);
  const [url, setUrl] = useState([]);
  const FRESHSERVICE_DOMAIN = "alpsdev-helpdesk.freshservice.com";
  const API_KEY = "WAMWIqJNrkfyavLB4jCG";

  const headers = {
    Authorization: `Basic ${btoa(API_KEY + ":X")}`,
    "Content-Type": "application/json",
  };

  const handleSubmitSearch = async (): Promise<void> => {
    if (searchQuery.trim() === "") {
      toast.error("Search query cannot be empty!", { position: "top-right" });
      return;
    }

    try {
      const response = await fetch(
        `https://${FRESHSERVICE_DOMAIN}/api/v2/objects/${searchQuery}/records`,
        { headers }
      );

      console.log(response)
      if (!response.ok) {
        toast.error(`Id not found`);
        setUrl([]);
      }

      const result: { records: { data: Record<string, any> }[] } =
        await response.json();

      const url: string[] =
        result.records
          .map((record) => {
            const dynamicKey = Object.keys(record.data).find(
              (key) =>
                typeof record.data[key] === "string" &&
                record.data[key].startsWith("http")
            );
            return dynamicKey ? record.data[dynamicKey] : null;
          })
          .find((url) => url !== null) || null;

      if (url.length !== 0) {
        setUrl([]);
        toast.success("Search successful!", { position: "top-right" });
      } else {
        setUrl([]);
        toast.error("No results found!", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container className="pt-3 d-flex flex-column align-items-center">
      <ToastContainer />
      <h2 className="mb-3 text-primary fw-bold">
        Freshservice Custom Object Search
      </h2>
      <InputGroup className="mb-3 w-75 shadow-sm">
        <InputGroup.Text className="bg-light border-0">🔍</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search Custom Objects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border-0 shadow-sm"
        />
        <Button
          variant="primary"
          onClick={handleSubmitSearch}
          className="px-4 shadow-sm"
        >
          Search
        </Button>
      </InputGroup>
      <Row className="justify-content-center w-100">
        {url && <p className="text-muted mt-2">{url}</p>}
        {/* {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Col md={4} className="mb-3" key={item.id}>
              <Card className="shadow-lg border-primary">
                <Card.Body>
                  <Card.Title className="text-primary">{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-muted mt-2">No results found</p>
        )} */}
      </Row>

      {url && url.length > 0 && (
        <Button
          variant="success"
          className="mt-3 shadow-sm"
          onClick={() => {
            url
              .filter((x) => x !== null)
              .forEach((link) => window.open(link, "_blank"));
          }}
        >
          Go to URLs
        </Button>
      )}
    </Container>
  );
};

export default FreshServiceApp;
