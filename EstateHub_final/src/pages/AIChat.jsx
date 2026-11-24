import { useState, useEffect, useRef } from "react";
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Stack,
  Divider,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";
import api from "../api/axios";

import { getImageUrl } from "../utils/imageUrl";

const enableModel = import.meta.env.VITE_ENABLE_AI !== "false";

const EMPTY_FILTERS = {
  propertyType: null,
  location: null,
  minPrice: null,
  maxPrice: null,
  bedrooms: null, // عدد غرف النوم بالضبط
  bedroomsMin: null, // أقل عدد غرف نوم مطلوب
};

function getPropertyImage(property) {
  const image = property.imageUrl || property.image;
  return image ? getImageUrl(image) : "";
}

function ChatPropertyCard({ property }) {
  return (
    <Card
      component={Link}
      to={`/properties/${property.id}`}
      sx={{
        display: "block",
        width: "100%",
        textDecoration: "none",
        color: "inherit",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
        transition: "transform .2s, box-shadow .2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 18px rgba(0,0,0,.14)",
        },
      }}
    >
      {getPropertyImage(property) && (
        <CardMedia
          component="img"
          height="145"
          image={getPropertyImage(property)}
          alt={property.title || "Property"}
        />
      )}

      <CardContent sx={{ p: 1.8 }}>
        <Typography fontWeight={800} fontSize={17}>
          {property.title || "عقار"}
        </Typography>

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ mt: 0.7 }}
        >
          <LocationOnIcon fontSize="small" color="action" />
          <Typography color="text.secondary" fontSize={14}>
            {property.location || "الموقع غير محدد"}
          </Typography>
        </Stack>

        <Typography color="primary" fontWeight={800} sx={{ mt: 1 }}>
          {Number(property.price || 0).toLocaleString("en-US")} جنيه
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          {property.bedrooms ?? property.beds ?? "-"} غرف •{" "}
          {property.bathrooms ?? property.baths ?? "-"} حمامات
        </Typography>

        <Typography
          color="primary"
          fontWeight={700}
          fontSize={13}
          sx={{ mt: 1 }}
        >
          اضغط لعرض التفاصيل ←
        </Typography>
      </CardContent>
    </Card>
  );
}

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

function normalizeLocation(value) {
  return normalize(value)
    .replace(/[أإآ]/g, "ا")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/القاهرة الجديدة|القاهره الجديده|new\s*cairo/g, "newcairo")
    .replace(/القاهره|القاهرة|القاره/g, "cairo")
    .replace(/الاسكندريه|الإسكندرية|اسكندريه/g, "alexandria")
    .replace(/الجيزه|الجيزة/g, "giza")
    .replace(/المعادي|معادي/g, "maadi")
    .replace(/almaadi/g, "maadi")
    .replace(/[^a-z0-9\u0600-\u06FF]/g, "");
}

function normalizePropertyType(value) {
  const type = normalize(value);
  if (["apartment", "apartments", "شقه", "شقة", "شقق"].includes(type))
    return "apartment";
  if (["villa", "villas", "فيلا", "فيلات"].includes(type)) return "villa";
  if (["house", "بيت", "منزل"].includes(type)) return "house";
  return type;
}

function extractLocationFromText(text) {
  const value = String(text || "")
    .toLowerCase()
    .replace(/[أإآ]/g, "ا");
  if (/(القاهره الجديده|القاهرة الجديدة|new\s*cairo)/i.test(value))
    return "New Cairo";
  if (/(اسكندريه|الإسكندرية|الاسكندريه|alexandria)/i.test(value))
    return "Alexandria";
  if (/(المعادي|معادي|maadi)/i.test(value)) return "Maadi";
  if (/(الجيزه|الجيزة|giza)/i.test(value)) return "Giza";
  if (/(القاهره|القاهرة|القاره|cairo)/i.test(value)) return "Cairo";
  return null;
}

function extractBedroomRules(text, filters) {
  const value = String(text || "")
    .toLowerCase()
    .replace(/[أإآ]/g, "ا");
  const moreThanOne =
    /(اكتر من واحده|اكثر من واحده|اكتر من واحد|اكثر من واحد|غرف اكتر من|غرف اكثر من|اكثر من غرفه|اكتر من غرفه|اكثر من غرف|اكتر من غرف|على الاقل غرفتين|غرفتين او اكثر|٢ غرف او اكثر)/i.test(
      value,
    );
  const exactOne =
    /(غرفه واحده|غرفة واحدة|غرفه واحد|غرفة واحد|استوديو|1\s*(غرف|غرفه|غرفة|bedrooms?|beds?))/i.test(
      value,
    );
  const exactTwo =
    /(غرفتين|غرفتان|اتنين غرف|اثنين غرف|2\s*(غرف|غرفه|غرفة|bedrooms?|beds?)|٢\s*(غرف|غرفه|غرفة))/i.test(
      value,
    );
  const exactThree =
    /(تلت غرف|تلات غرف|ثلاث غرف|ثلاثة غرف|3\s*(غرف|غرفه|غرفة|bedrooms?|beds?)|٣\s*(غرف|غرفه|غرفة))/i.test(
      value,
    );
  const exactFour =
    /(اربع غرف|اربعة غرف|4\s*(غرف|غرفه|غرفة|bedrooms?|beds?)|٤\s*(غرف|غرفه|غرفة))/i.test(
      value,
    );

  if (moreThanOne) {
    filters.bedrooms = null;
    filters.bedroomsMin = 2;
  } else if (exactOne) {
    filters.bedrooms = 1;
    filters.bedroomsMin = null;
  } else if (exactTwo) {
    filters.bedrooms = 2;
    filters.bedroomsMin = null;
  } else if (exactThree) {
    filters.bedrooms = 3;
    filters.bedroomsMin = null;
  } else if (exactFour) {
    filters.bedrooms = 4;
    filters.bedroomsMin = null;
  }
}

function formatFilters(filters) {
  const details = [];

  if (filters.propertyType) {
    details.push(`نوع العقار: ${filters.propertyType}`);
  }

  if (filters.location) {
    details.push(`الموقع: ${filters.location}`);
  }

  if (filters.minPrice != null) {
    details.push(
      `السعر يبدأ من: ${Number(filters.minPrice).toLocaleString("en-US")} جنيه`,
    );
  }

  if (filters.maxPrice != null) {
    details.push(
      `أقصى سعر: ${Number(filters.maxPrice).toLocaleString("en-US")} جنيه`,
    );
  }

  if (filters.bedrooms != null) {
    details.push(`عدد غرف النوم بالضبط: ${filters.bedrooms}`);
  } else if (filters.bedroomsMin != null) {
    details.push(`عدد غرف النوم: ${filters.bedroomsMin} أو أكثر`);
  }

  return details;
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatFilters, setChatFilters] = useState(EMPTY_FILTERS);
  const [excludedIds, setExcludedIds] = useState([]);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "أهلًا بيك في EstateHub! 👋🏡\n\n" +
        "أنا مساعدك العقاري الذكي. أقدر أساعدك تلاقي العقار المناسب ليك.\n\n" +
        "بتدور على شقة ولا فيلا؟ وميزانيتك كام؟",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, open]);

  const handleSend = async () => {
    const text = message.trim();
    if (!text || loading) return;

    setMessages((previous) => [...previous, { sender: "user", text }]);
    setMessage("");
    setLoading(true);

    try {
      const normalizedText = text
        .toLowerCase()
        .replace(/[أإآ]/g, "ا")
        .replace(/[؟?!،,]/g, " ")
        .trim();
      const isReset = /^(بحث جديد|ابدأ بحث جديد|ابدأ من جديد|reset)$/i.test(
        text.trim(),
      );
      const asksName =
        /(اسمك ايه|اسمك اي|انت مين|مين انت|ما اسمك|اسم المساعد ايه)/i.test(
          normalizedText,
        );
      const asksGeneral =
        /(انت بتعمل اي|بتعمل ايه|بتعمل اي|وظيفتك ايه|ايه وظيفتك|تقدر تساعدني|ازيك|السلام عليكم|اهلا|مرحبا|شكرا)/i.test(
          normalizedText,
        );
      const hasSearchIntent =
        /(شقه|شقة|شقق|فيلا|بيت|منزل|عقار|القاهره|القاهرة|القاره|الجيزه|الجيزة|اسكندريه|الاسكندريه|الإسكندرية|المعادي|معادي|ميزانيه|ميزانية|سعر|جنيه|مليون|الف|غرف|غرفة|استوديو|ابحث|دورلي|عاوز|عايز|محتاج|هاتلي|اعرض|وريني|شوف|اسكندريه|cairo|alexandria|maadi)/i.test(
          normalizedText,
        );

      if (asksName || (asksGeneral && !hasSearchIntent)) {
        setMessages((previous) => [
          ...previous,
          {
            sender: "ai",
            text: asksName
              ? "أنا EstateHub AI 🏡، مساعدك العقاري. أقدر أساعدك تدور على عقار حسب المنطقة والسعر وعدد الغرف."
              : "أنا مساعد EstateHub العقاري 🏡. أقدر أساعدك تلاقي شقق أو فيلات أو بيوت حسب المنطقة والميزانية وعدد غرف النوم. مثال: عاوز شقة في القاهرة بأقل من 3 مليون وتكون غرفتين.",
          },
        ]);
        return;
      }

      let nextFilters = isReset ? { ...EMPTY_FILTERS } : { ...chatFilters };
      if (!isReset) {
        if (enableModel) {
          // اسأل نموذج Ollama عن الفلاتر، ثم نطبّق قواعد واضحة للكلمات المعروفة محليًا.
          try {
            const aiResponse = await api.post("/ai/parse", {
              question: text,
              currentFilters: chatFilters,
            });
            const extracted = aiResponse.data || {};
            for (const key of [
              "propertyType",
              "location",
              "minPrice",
              "maxPrice",
              "bedrooms",
              "bedroomsMin",
            ]) {
              if (extracted[key] !== undefined && extracted[key] !== null)
                nextFilters[key] = extracted[key];
            }
          } catch (aiError) {
            // ما زال البحث ممكنًا باستخدام قواعد الكلمات المحلية لو خدمة AI غير متاحة.
            console.warn(
              "AI filter extraction failed; using local parsing",
              aiError,
            );
          }
        }

        const detectedLocation = extractLocationFromText(text);
        if (detectedLocation) nextFilters.location = detectedLocation;

        if (/(شقه|شقة|شقق|apartment|apartments)/i.test(normalizedText))
          nextFilters.propertyType = "apartment";
        else if (/(فيلا|فيلات|villa|villas)/i.test(normalizedText))
          nextFilters.propertyType = "villa";
        else if (/(بيت|منزل|house)/i.test(normalizedText))
          nextFilters.propertyType = "house";

        extractBedroomRules(text, nextFilters);

        // الأسعار: القواعد المحلية تمنع الاعتماد على تخمين غير صحيح من النموذج.
        const millionUnder = normalizedText.match(
          /(?:اقل من|أقل من|تحت)\s*(\d+(?:\.\d+)?)\s*مليون/,
        );
        const millionOver = normalizedText.match(
          /(?:اكثر من|أكثر من|فوق)\s*(\d+(?:\.\d+)?)\s*مليون/,
        );
        const millionWordUnder =
          /(اقل من|أقل من|تحت)\s*(عشره|عشرة)\s*مليون/.test(normalizedText);
        if (millionUnder)
          nextFilters.maxPrice = Number(millionUnder[1]) * 1_000_000;
        else if (millionWordUnder) nextFilters.maxPrice = 10_000_000;
        if (millionOver)
          nextFilters.minPrice = Number(millionOver[1]) * 1_000_000;

        const exactMax = normalizedText.match(
          /(?:اقل من|أقل من|تحت)\s*(\d{6,})/,
        );
        const exactMin = normalizedText.match(
          /(?:اكثر من|أكثر من|فوق)\s*(\d{6,})/,
        );
        if (exactMax) nextFilters.maxPrice = Number(exactMax[1]);
        if (exactMin) nextFilters.minPrice = Number(exactMin[1]);
      }

      setChatFilters(nextFilters);
      if (isReset) {
        setExcludedIds([]);
        setMessages((previous) => [
          ...previous,
          { sender: "ai", text: "بدأنا بحث جديد 🏡\nقولّي بتدور على إيه؟" },
        ]);
        return;
      }

      const propertiesResponse = await api.get("/property");
      const allProperties = Array.isArray(propertiesResponse.data)
        ? propertiesResponse.data
        : [];
      const requestedType = normalizePropertyType(nextFilters.propertyType);
      const requestedArea = normalizeLocation(nextFilters.location);
      const minPrice =
        nextFilters.minPrice == null || nextFilters.minPrice === ""
          ? null
          : Number(nextFilters.minPrice);
      const maxPrice =
        nextFilters.maxPrice == null || nextFilters.maxPrice === ""
          ? null
          : Number(nextFilters.maxPrice);
      const bedrooms =
        nextFilters.bedrooms == null || nextFilters.bedrooms === ""
          ? null
          : Number(nextFilters.bedrooms);
      const bedroomsMin =
        nextFilters.bedroomsMin == null || nextFilters.bedroomsMin === ""
          ? null
          : Number(nextFilters.bedroomsMin);
      const action =
        /(هات غيرها|هات غيرهم|غيرها|غيرهم|حاجة غير|حاجه غير|واحد تاني|واحدة تانية|another|different)/i.test(
          text,
        )
          ? "more"
          : "search";

      // إزالة التكرار حسب المعرّف ثم حسب بصمة الإعلان، لمعالجة السجلات المستوردة المكررة.
      const byId = new Map();
      for (const property of allProperties) {
        if (property?.id != null) byId.set(String(property.id), property);
      }
      const seenSignatures = new Set();
      const uniqueProperties = [...byId.values()].filter((property) => {
        const signature = [
          property.title,
          property.location,
          property.price,
          property.bedrooms ?? property.beds,
        ]
          .map((v) => normalize(v))
          .join("|");
        if (seenSignatures.has(signature)) return false;
        seenSignatures.add(signature);
        return true;
      });

      const matching = uniqueProperties.filter((property) => {
        const status = normalize(property.propertyStatus || property.status);
        if (status !== "approved") return false;

        const type = normalizePropertyType(
          property.propertyType || property.type,
        );
        const location = normalizeLocation(property.location);
        const price = Number(property.price);
        const bedsRaw = property.bedrooms ?? property.beds;
        const beds = Number(bedsRaw);

        // استبعاد السجلات الواضح فسادها بدل عرض بيانات مثل 343 غرفة.
        if (!Number.isFinite(price) || price <= 0) return false;
        if (
          bedsRaw != null &&
          (!Number.isInteger(beds) || beds < 0 || beds > 20)
        )
          return false;

        const typeMatches =
          !requestedType || requestedType === "all" || type === requestedType;
        const locationMatches =
          !requestedArea ||
          location === requestedArea ||
          (requestedArea === "cairo" && location.includes("cairo")) ||
          (requestedArea !== "cairo" && location.includes(requestedArea));
        const minMatches =
          minPrice == null || !Number.isFinite(minPrice) || price >= minPrice;
        const maxMatches =
          maxPrice == null || !Number.isFinite(maxPrice) || price <= maxPrice;
        const bedroomsMatch =
          (bedrooms == null || beds === bedrooms) &&
          (bedroomsMin == null || beds >= bedroomsMin);

        return (
          typeMatches &&
          locationMatches &&
          minMatches &&
          maxMatches &&
          bedroomsMatch
        );
      });

      const alreadyExcluded = action === "more" ? excludedIds : [];
      const freshResults = matching.filter(
        (property) => !alreadyExcluded.includes(String(property.id)),
      );
      const shownResults = action === "more" ? freshResults : matching;
      const shownIds = shownResults.map((property) => String(property.id));
      setExcludedIds(
        action === "more"
          ? [...new Set([...excludedIds, ...shownIds])]
          : shownIds,
      );

      const details = formatFilters(nextFilters);
      let reply;
      if (shownResults.length) {
        reply =
          `${action === "more" ? "لقيتلك نتائج تانية" : `لقيتلك ${shownResults.length} عقار مطابق لطلبك`} 🏡` +
          (details.length ? `\n\n${details.join("\n")}` : "");
      } else if (action === "more" && matching.length) {
        reply =
          "عرضتلك كل العقارات المطابقة المتاحة بالفعل. مفيش نتائج مختلفة تانية بنفس الشروط؛ ممكن نوسّع البحث.";
      } else if (details.length) {
        reply = `فهمت شروط البحث:\n\n${details.join("\n")}\n\nملقتش عقارات معتمدة مطابقة للشروط دي. جرّب تغيّر شرط أو توسّع البحث.`;
      } else {
        reply =
          "محتاج أعرف تفاصيل أكتر: نوع العقار، المنطقة، الميزانية، وعدد الغرف.";
      }

      setMessages((previous) => [
        ...previous,
        { sender: "ai", text: reply, properties: shownResults },
      ]);
    } catch (error) {
      console.error("AI/property search failed:", error);
      let errorMessage = "حصلت مشكلة أثناء البحث. حاول تاني.";
      if (error.response?.status === 401 || error.response?.status === 403)
        errorMessage = "لازم تسجّل الدخول أو تتأكد إن جلسة تسجيل الدخول صالحة.";
      else if (!error.response)
        errorMessage =
          "مش قادر أوصل للسيرفر. اتأكد إن Spring Boot شغال وإن خدمة العقارات متاحة.";
      setMessages((previous) => [
        ...previous,
        { sender: "ai", text: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setChatFilters({ ...EMPTY_FILTERS });
    setExcludedIds([]);

    setMessages([
      {
        sender: "ai",
        text: "بدأنا بحث جديد 🏡\nقولّي بتدور على إيه؟",
      },
    ]);
  };
  return (
    <>
      <Fab
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Open AI assistant"
        sx={{
          position: "fixed",
          bottom: { xs: 18, sm: 28 },
          right: { xs: 18, sm: 28 },
          zIndex: 1400,
          width: { xs: 68, sm: 76 },
          height: { xs: 68, sm: 76 },
          bgcolor: "#153D32",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,.28)",
          "&:hover": {
            bgcolor: "#205847",
            transform: "scale(1.04)",
          },
        }}
      >
        {open ? (
          <CloseIcon sx={{ fontSize: 34 }} />
        ) : (
          <SmartToyOutlinedIcon sx={{ fontSize: 38 }} />
        )}
      </Fab>

      {open && (
        <Paper
          elevation={18}
          sx={{
            position: "fixed",
            right: { xs: 10, sm: 28 },
            bottom: { xs: 98, sm: 120 },
            width: {
              xs: "calc(100vw - 20px)",
              sm: 460,
              md: 500,
            },
            height: {
              xs: "min(760px, calc(100dvh - 120px))",
              sm: "min(720px, calc(100dvh - 150px))",
            },
            minHeight: { xs: 360, sm: 450 },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: { xs: 2, sm: 2.5 },
            zIndex: 1399,
            border: "1px solid #e2e8f0",
          }}
        >
          <Box
            sx={{
              px: { xs: 2.5, sm: 3 },
              py: { xs: 2.2, sm: 2.5 },
              bgcolor: "#153D32",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexShrink: 0,
            }}
          >
            <Avatar
              sx={{
                width: { xs: 52, sm: 58 },
                height: { xs: 52, sm: 58 },
                bgcolor: "white",
                color: "#153D32",
              }}
            >
              <SmartToyOutlinedIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: 21, sm: 24 },
                  fontWeight: 900,
                  lineHeight: 1.4,
                }}
              >
                EstateHub AI
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  color: "#d5eee4",
                  mt: 0.3,
                }}
              >
                مساعدك العقاري الذكي 🏡
              </Typography>
            </Box>

            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              sx={{
                color: "white",
                width: 48,
                height: 48,
              }}
            >
              <CloseIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>

          <Divider />

          <Stack
            spacing={2}
            sx={{
              flex: 1,
              minHeight: 0,
              p: { xs: 1.5, sm: 2 },
              overflowY: "auto",
              bgcolor: "#f4f7fb",
              "&::-webkit-scrollbar": { width: 7 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#cbd5e1",
                borderRadius: 3,
              },
            }}
          >
            {messages.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent:
                    item.sender === "user" ? "flex-end" : "flex-start",
                  gap: 1,
                  minWidth: 0,
                }}
              >
                {item.sender === "ai" && (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#153D32",
                      flexShrink: 0,
                    }}
                  >
                    <SmartToyOutlinedIcon sx={{ fontSize: 23 }} />
                  </Avatar>
                )}

                <Box
                  sx={{
                    maxWidth: item.properties?.length ? "88%" : "84%",
                    minWidth: 0,
                    px: { xs: 1.5, sm: 2 },
                    py: 1.5,
                    borderRadius:
                      item.sender === "user"
                        ? "14px 14px 3px 14px"
                        : "14px 14px 14px 3px",
                    bgcolor: item.sender === "user" ? "#dceafe" : "#fff",
                    color: "#172033",
                    boxShadow: "0 2px 7px rgba(15,23,42,.07)",
                    overflowWrap: "anywhere",
                  }}
                >
                  {item.text && (
                    <Typography
                      sx={{
                        fontSize: { xs: 16, sm: 17 },
                        fontWeight: 500,
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        direction: "auto",
                      }}
                    >
                      {item.text}
                    </Typography>
                  )}

                  {item.properties?.length > 0 && (
                    <Stack spacing={1.5} sx={{ mt: 1.5, width: "100%" }}>
                      {item.properties.map((property) => (
                        <ChatPropertyCard
                          key={property.id}
                          property={property}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>

                {item.sender === "user" && (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#1769e0",
                      flexShrink: 0,
                    }}
                  >
                    <AccountCircleOutlinedIcon sx={{ fontSize: 25 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {loading && (
              <Box
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: "white",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontSize: 16 }}>
                  المساعد بيفهم طلبك وبيبحث عن العقارات... ⏳
                </Typography>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Stack>

          <Box
            sx={{
              p: 1.5,
              bgcolor: "#fff",
              borderTop: "1px solid #dbe3ed",
              flexShrink: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="اكتب رسالتك هنا..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  "& .MuiOutlinedInput-root": {
                    minHeight: 54,
                    borderRadius: "12px",
                    bgcolor: "#f1f5f9",
                    fontSize: 16,
                    padding: "10px 12px",
                    "& fieldset": {
                      border: "1px solid #94a3b8",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1769e0",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: 16,
                    lineHeight: 1.5,
                  },
                }}
              />

              <IconButton
                onClick={handleSend}
                disabled={!message.trim() || loading}
                aria-label="إرسال الرسالة"
                sx={{
                  width: 54,
                  height: 54,
                  minWidth: 54,
                  flexShrink: 0,
                  borderRadius: 2,
                  bgcolor: "#1769e0",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(23,105,224,.25)",
                  "&:hover": { bgcolor: "#0d47a1" },
                  "&.Mui-disabled": {
                    bgcolor: "#1769e0",
                    color: "#fff",
                    opacity: 0.65,
                  },
                }}
              >
                <SendIcon sx={{ fontSize: 27 }} />
              </IconButton>
            </Stack>

            <Typography
              component="button"
              onClick={resetChat}
              sx={{
                display: "block",
                mt: 1,
                p: 0,
                border: 0,
                bgcolor: "transparent",
                color: "#64748b",
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              بدء بحث جديد
            </Typography>
          </Box>
        </Paper>
      )}
    </>
  );
}
