import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Box, Alert } from "@mui/material";
import { requireService } from "../services/ServiceRegistry";
import type { PageServiceClass } from "../services/PageService";

const PageRouteDemo: React.FC = () => {
  const { pageType, pageEntityId } = useParams();

  if (!pageType || !pageEntityId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Invalid page route. Both pageType and pageEntityId are required.
        </Alert>
      </Box>
    );
  }

  const pageService = requireService<PageServiceClass>("PageService");

  if (!pageService.pageExists(pageType)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Page type "{pageType}" not found in registry.
        </Alert>
      </Box>
    );
  }

  const DynamicPage = React.lazy(pageService.getPageLoader(pageType));

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <DynamicPage
        pageId={pageType}
        inputModel={{}}
        pageEntityId={pageEntityId}
      />
    </Suspense>
  );
};

export default PageRouteDemo;
