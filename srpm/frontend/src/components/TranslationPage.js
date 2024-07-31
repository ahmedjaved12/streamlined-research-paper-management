import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import axios from 'axios';

const TranslationPage = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/backend/translate', {
        params: {
          text: inputText,
          to: selectedLanguage, 
        },
      });
      setTranslatedText(JSON.stringify(response.data));
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
          label="Enter text to translate"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ margin: "20px" }}
        >
        </TextField>
        <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            fullWidth
            variant="standard"
            style={{ margin: "20px" }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ur">Urdu</MenuItem>
            <MenuItem value="zh-CN">Chinese</MenuItem>
            <MenuItem value="it">Italian</MenuItem>
            <MenuItem value="ar">Arabic</MenuItem>
          </Select>
      </Grid>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTranslate}
          disabled={isLoading}
          style={{ minWidth: "120px" }}
        >
          {isLoading ? "Translating..." : "Translate"}
        </Button>
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        <TextField
          label="Translated text"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          value={translatedText}
          InputProps={{
            readOnly: true,
          }}
          style={{ margin: "20px" }}
        />
      </Grid>
    </Grid>
  );
};

export default TranslationPage;
