import React, { useState, useEffect } from "react";
import { ChakraProvider } from '@chakra-ui/react'
import { Button, Input, Box, Stack, Select, Heading} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';
import{
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

function App() {
  const [showDialog, setShowDialog] = useState(false); 
  const [entry, setEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [llmData, setLlmData] = useState({
    company: "",
    model_name: "",
    category: "",
    release_date: "",
    num_million_parameters: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  // for filtered companies and categories
  const [companyFilter, setCompanyFilter] = useState("");  
  const [categoryFilter, setCategoryFilter] = useState("");
  // for all (available) companies and categories
  const [companies, setCompanies] = useState(null);
  const [categories, setCategories] = useState(null);
  const [llmList, setLlmList] = useState([]);


  useEffect(() => {
    const fetchLLMs = async () => {
      try {
        const response = await fetch("http://localhost:8000/llms");
        const data = await response.json();

        const llms = data.llms;

        if (response.ok) {
          console.log("LLMs fetched successfully");
          setLlmList(llms);
          setFilteredData(llms); // initially set filtered data to all LLMs
          setCompanies([...new Set(llms.map((llm) => llm.company))]);
          setCategories([...new Set(llms.map((llm) => llm.category))]);
        } else {
          alert("Failed to fetch LLM data");
        }
        
      } catch (error) {
        console.error("Error fetching LLM data:", error);
      }
    };

    fetchLLMs();
  }, [entry]); 

  console.log("Filtered Data:", filteredData);

  
  useEffect(() => {
    let filtered = llmList;
    if (companyFilter) {
      filtered = filtered.filter((llm) =>
        llm.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((llm) =>
        llm.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }
    setFilteredData(filtered);
  }, [companyFilter, categoryFilter]);


  const handleRandomLLM = async () => {
    try {
      const response = await fetch("http://localhost:8000/llm", {
          method: "POST", 
          body: JSON.stringify({ mode: "random" }),
          headers: { "Content-Type": "application/json"}
      });
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        setEntry(responseData.entry);
        setShowDialog(true);
      } else {
        alert("Failed to add random LLM");
      }
    } catch (error) {
      alert("Error adding LLM");
    }
  };

  const handleChange = (e) => {
    setLlmData({ ...llmData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true); 
    if (!llmData.company || !llmData.model_name || !llmData.category || !llmData.release_date || !llmData.num_million_parameters) {
      return; 
    }

    const requestBody = {
      mode: "manual",
      llm: {
        ...llmData,
        num_million_parameters: parseInt(llmData.num_million_parameters, 10),
      },
    };

    console.log("Sending request body:", requestBody); 
  
    try {
      const response = await fetch("http://localhost:8000/llm", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" }
       
      });
  
      const responseData = await response.json();
      console.log("Response data:", responseData);
  
      if (response.ok) {
        setLlmData({
          company: "",
          model_name: "",
          category: "",
          release_date: "",
          num_million_parameters: "",
        });
        setShowForm(false);
        setIsSubmitted(false);
        setEntry(responseData.entry); 
        setShowDialog(true);
      } else {
        alert("Failed to add LLM");
      }
    } catch (error) {
      alert("Error adding LLM");
    }
  };
  
  const handleCancel = async (e) => {
    e.preventDefault();
    setShowForm(false); 
    setIsSubmitted(false);
  }

  return (
    <ChakraProvider>
      <Box p={4}>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} p={4}>
            Add LLM
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleRandomLLM()}>Add Random LLM from "llm.csv"</MenuItem>
            <MenuItem onClick ={() => setShowForm(true)}>Insert Custom LLM</MenuItem>
          </MenuList>
        </Menu>
        <Box maxW="80%" mx="auto" overflowX="auto">
          <Stack direction="row" spacing={4} mt={4}>
            <Select placeholder="Filter by Company" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} mb={10} pr={2}>
              <option value="">No Filter</option> 
              {companies === null ? (
                <option>Loading...</option>
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))
              ) : (
                <option>No companies available</option>
              )}
            </Select>
            
            <Select placeholder="Filter by Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} mb={10}>
              <option value="">No Filter</option> 
              {categories === null ? (
                <option>Loading...</option>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                <option key={category} value={category}>{category}</option>
                ))
              ) : (
                <option>No categories available</option>
              )}
            </Select>
          </Stack>
        </Box>
        <Box maxW="80%" mx="auto" overflowX="auto">
          <TableContainer>
            <Heading size="md" mb={4} textAlign="center">LLM Data</Heading>
            <Table variant="striped" colorScheme="gray">
              <TableCaption>List of all LLMs</TableCaption>
              <Thead>
                <Tr>
                  <Th>Company</Th>
                  <Th>Model Name</Th>
                  <Th>Category</Th>
                  <Th>Release Date</Th>
                  <Th isNumeric>Parameters (in Millions)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredData === null ? (
                  <Tr>
                    <Td colSpan="5">Loading...</Td>
                  </Tr>
                ) : Array.isArray(filteredData) ? (
                  filteredData.map((llm, index) => (
                    <Tr key={index}>
                      <Td>{llm.company}</Td>
                      <Td>{llm.model_name}</Td>
                      <Td>{llm.category}</Td>
                      <Td>{llm.release_date}</Td>
                      <Td isNumeric>{llm.num_million_parameters}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="5">No data available</Td>
                  </Tr>
                )}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Company</Th>
                  <Th>Model Name</Th>
                  <Th>Category</Th>
                  <Th>Release Date</Th>
                  <Th isNumeric>Parameters (in Millions)</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
        {showDialog && entry && (
          <AlertDialog isOpen={showDialog} onClose={() => setShowDialog(false)}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                LLM Added Successfully!
              </AlertDialogHeader>

              <AlertDialogBody>
                <p><strong>Company:</strong> {entry.company}</p>
                <p><strong>Model Name:</strong> {entry.model_name}</p>
                <p><strong>Category:</strong> {entry.category}</p>
                <p><strong>Release Date:</strong> {entry.release_date}</p>
                <p><strong>Parameters:</strong> {entry.num_million_parameters}M</p>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={() => setShowDialog(false)}>OK</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        )}
        
        {showForm && (
          <AlertDialog isOpen={showForm} onClose={() => setShowForm(false)}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Add Custom LLM
                </AlertDialogHeader>
                <AlertDialogBody>
                  <FormControl isInvalid={isSubmitted && !llmData.company}>
                    <FormLabel>Company Name</FormLabel>
                    <Input name="company" value={llmData.company} onChange={handleChange} />
                    {isSubmitted && !llmData.company && <FormErrorMessage>This field is required.</FormErrorMessage>}
                  </FormControl>

                  <FormControl mt={4} isInvalid={isSubmitted && !llmData.model_name}>
                    <FormLabel>Model Name</FormLabel>
                    <Input name="model_name" value={llmData.model_name} onChange={handleChange} />
                    {isSubmitted && !llmData.model_name && <FormErrorMessage>This field is required.</FormErrorMessage>}
                  </FormControl>

                  <FormControl mt={4} isInvalid={isSubmitted && !llmData.category}>
                    <FormLabel>Category</FormLabel>
                    <Input name="category" value={llmData.category} onChange={handleChange} />
                    {isSubmitted && !llmData.category && <FormErrorMessage>This field is required.</FormErrorMessage>}
                  </FormControl>

                  <FormControl mt={4} isInvalid={isSubmitted && !llmData.release_date}>
                    <FormLabel>Release Date</FormLabel>
                    <Input type="date" name="release_date" value={llmData.release_date} onChange={handleChange} />
                    {isSubmitted && !llmData.release_date && <FormErrorMessage>This field is required.</FormErrorMessage>}
                  </FormControl>

                  <FormControl mt={4} isInvalid={isSubmitted && !llmData.num_million_parameters}>
                    <FormLabel>Number of Parameters (in Millions)</FormLabel>
                    <Input
                      type="number"
                      name="num_million_parameters"
                      value={llmData.num_million_parameters}
                      onChange={handleChange}
                    />
                    {isSubmitted && !llmData.num_million_parameters && <FormErrorMessage>This field is required.</FormErrorMessage>}
                  </FormControl>
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button colorScheme="blue" onClick={handleSubmit}>
                    Submit
                  </Button>
                  <Button onClick={handleCancel} ml={3}>
                    Cancel
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        )}


      </Box>
    </ChakraProvider>
  );  
}

export default App;
