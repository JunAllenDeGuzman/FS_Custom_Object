/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { RefreshCw, LinkIcon } from "lucide-react";

export type ObjectData = {
  id: number;
  title: string;
};

export type RecordData = {
  title: string;
  urls: string[];
};

const FreshserviceObjectData: React.FC = () => {
  const [objectsData, setObjectsData] = useState<ObjectData[]>([]);
  // const [objectsData, setobjectsData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [newObject, setNewObject] = useState<Partial<ObjectData>>({
  //   name: "",
  //   description: "",
  // });
  const [recrodData, setRecordData] = useState<RecordData[]>([]);

  // Replace with your Freshservice domain and API key
  const FRESHSERVICE_DOMAIN = "alpsdev-helpdesk.freshservice.com";
  const API_KEY = "WAMWIqJNrkfyavLB4jCG";

  const headers = {
    Authorization: `Basic ${btoa(API_KEY + ":X")}`,
    "Content-Type": "application/json",
  };

  const fetchObjectDatas = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${FRESHSERVICE_DOMAIN}/api/v2/objects`,
        { headers }
      );
      const data: { custom_objects: ObjectData[] } = await response.json();

      const extractedData: ObjectData[] = data.custom_objects.map(
        (obj: ObjectData) => ({
          id: obj.id,
          title: obj.title || "Untitled", // Default to "Untitled" if no title
        })
      );

      setObjectsData(extractedData); // ✅ Now correctly storing ID & Title
    } catch (error) {
      console.error("Error fetching custom objects:", error);
    }
    setLoading(false);
  };

  //   const fetchObjectDatas1 = async (): Promise<void> => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`https://${FRESHSERVICE_DOMAIN}/api/v2/objects/32000013408/records`, { headers });
  //       const data = await response.json();

  //       // Ensure data.records exists and has the correct type
  //     if (data.records && Array.isArray(data.records)) {
  //         // Define the type for records
  //         type RecordType = {
  //           data?: {
  //             freshapi?: string;
  //           };
  //         };

  //         // Extract all freshapi values
  //         const freshAPIs: string[] = data.records
  //           .map((record: RecordType) => record.data?.freshapi)
  //           .filter((api: string | undefined): api is string => api !== undefined); // Remove undefined values

  //       } else {
  //       }

  //       setObjects(data.custom_objects);
  //     } catch (error) {
  //       console.error('Error fetching custom objects:', error);
  //     }
  //     setLoading(false);
  //   };

  // const createObjectData = async (): Promise<void> => {
  //   if (!newObject.name || !newObject.description) return;
  //   try {
  //     const response = await fetch(
  //       `https://${FRESHSERVICE_DOMAIN}/api/v2/custom_objects`,
  //       {
  //         method: "POST",
  //         headers,
  //         body: JSON.stringify({ custom_object: newObject }),
  //       }
  //     );
  //     if (response.ok) {
  //       setNewObject({ name: "", description: "" });
  //       fetchObjectDatas();
  //     }
  //   } catch (error) {
  //     console.error("Error creating custom object:", error);
  //   }
  // };

  // const deleteObjectData = async (id: number): Promise<void> => {
  //   try {
  //     await fetch(
  //       `https://${FRESHSERVICE_DOMAIN}/api/v2/custom_objects/${id}`,
  //       {
  //         method: "DELETE",
  //         headers,
  //       }
  //     );
  //     fetchObjectDatas();
  //   } catch (error) {
  //     console.error("Error deleting custom object:", error);
  //   }
  // };

  useEffect(() => {
    fetchObjectDatas();
    // fetchObjectDatas1();
  }, []);

  useEffect(() => {
    const fetchRecords = async (): Promise<void> => {
      try {
        const responses = await Promise.all(
          objectsData.map(async (obj) => {
            const response = await fetch(
              `https://${FRESHSERVICE_DOMAIN}/api/v2/objects/${obj.id}/records`,
              { headers }
            );
            const result: { records: { data: Record<string, any> }[] } =
              await response.json();

            const extractedData: RecordData[] = result.records
              .map((record) => {
                const data = record.data;

                // Extract all URLs dynamically
                const urls: string[] = Object.values(data).filter(
                  (value) =>
                    typeof value === "string" && value.startsWith("http")
                );
                return urls.length > 0 ? { title: obj.title, urls } : null;
              })
              .filter((item): item is RecordData => item !== null);

            return extractedData;
          })
        );

        setRecordData(responses.flat()); // Check if multiple URLs are present
        /// setGetRecords(responses.flat());
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    if (objectsData.length > 0) {
      fetchRecords();
    }
  }, [objectsData]);

  return (
    <Card className="w-100 mx-auto mt-4 p-3 shadow-lg">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="me-5">Freshservice Custom Objects</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={fetchObjectDatas}
          disabled={loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="mb-3 d-flex gap-2">
          {/* <Form.Control
            type="text"
            placeholder="Object Name"
            value={newObject.name || ""}
             onChange={(e) =>
              setNewObject({ ...newObject, name: e.target.value })
            }
          />
          <Form.Control
            type="text"
            placeholder="Description"
             value={newObject.description || ""}
             onChange={(e) =>
              setNewObject({ ...newObject, description: e.target.value })
             }
          />
          <Button variant="success" onClick={createObjectData}>
            <Plus className="h-4 w-4" />
          </Button> */}
        </div>
        <div className="list-group">
          {recrodData.map((obj, index) => (
            <div
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center p-3"
            >
              <div>
                <h6 className="mb-2 fw-bold">{obj.title}</h6>
                {/* Display multiple URLs as buttons with tooltips */}
                {obj.urls && obj.urls.length > 0 && (
                  <div className="d-flex flex-wrap gap-2">
                    {obj.urls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center"
                        title={url} // Shows the full URL when hovering
                        style={{ gap: "5px" }}
                      >
                        <LinkIcon className="h-4 w-4" /> Link {idx + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* <Button variant="outline-danger" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button> */}
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default FreshserviceObjectData;
