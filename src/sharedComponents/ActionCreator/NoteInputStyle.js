export default {
  control: {
    backgroundColor: "#FAFAFA",
    border: "1px solid #eee",
    fontSize: 14,
    fontWeight: "normal"
  },

  highlighter: {
    overflow: "hidden"
  },

  input: {
    margin: 0
  },

  "&multiLine": {
    control: {
      borderRadius: 4,
      // boxShadow: "0 0 1px 0 rgba(0,0,0,0.1)",
      marginBottom: 10,
      minHeight: 90
    },

    highlighter: {
      padding: 15
    },

    input: {
      fontSize: 16,
      padding: 15,
      minHeight: 90,
      outline: 0,
      border: 0
    }
  },

  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      borderRadius: 4,
      fontSize: 14,
      maxHeight: 300,
      overflowY: "auto"
    },

    item: {
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      padding: "10px",

      "&focused": {
        backgroundColor: "#E6E9EC"
      }
    }
  }
};
