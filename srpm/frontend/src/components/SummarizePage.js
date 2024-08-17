import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import axios from 'axios';

const SummarizePage = () => {
  const [inputText, setInputText] = useState("");
  const [summarizedText, setSummarizedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/backend/summarize', {
        params: {
          text: inputText,
        },
      });
      setSummarizedText(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={12} sm={8} md={6}>
        <TextField
          label="Enter text to summarize"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ margin: "20px" }}
        />
      </Grid>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSummarize}
          disabled={isLoading}
          style={{ minWidth: "120px" }}
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </Button>
      </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            label="Summarized text"
            variant="outlined"
            fullWidth
            multiline
            rows={8}
            value={summarizedText}
            InputProps={{
              readOnly: true,
            }}
            style={{ margin: "20px" }}
          />
        </Grid>
    </Grid>
  );
};

export default SummarizePage;
