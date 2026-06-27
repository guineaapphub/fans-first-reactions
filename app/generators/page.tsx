"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type VideoType =
  | "Fan Reactions"
  | "Mixed Fans"
  | "Rivals & Haters"
  | "Post-Match"
  | "Signing / Sacking";

type EventType =
  | "home_goal"
  | "away_goal"
  | "red_card"
  | "var"
  | "penalty"
  | "custom";

type Club = {
  id?: string;
  name: string;
  slug: string;
  league_id?: string | null;
  league_slug?: string | null;
  league?: string | null;
  league_name?: string | null;
};

type League = {
  id?: string;
  name: string;
  slug: string;
};

type Creator = {
  id?: string;
  name: string;
  slug?: string;
  url?: string | null;
  youtube_url?: string | null;
  channel_url?: string | null;
  club_id?: string | null;
  club_slug?: string | null;
  club?: string | null;
  club_name?: string | null;
  league?: string | null;
};

type FeaturedChannel = {
  team: string;
  creator: string;
  url?: string;
};

type SelectOption = {
  value: string;
  label: string;
};

type SocialLinks = {
  instagram: string;
  x: string;
  youtube: string;
  tiktok: string;
  website: string;
};

type AffiliateLink = {
  label: string;
  url: string;
};

const BRAND = "#67e1f9";
const MULTI_CLUB_OPTION = "Multi-Club / Other";

const LEAGUE_ORDER = [
  "premier-league",
  "championship",
  "league-one",
  "league-two",
  "scottish-premiership",
  "bundesliga",
  "la-liga",
  "serie-a",
  "ligue-1",
];

const LEAGUE_LOGOS: Record<string, string> = {
  "premier-league": "/league-logos/premier-league.png",
  championship: "/league-logos/championship.png",
  "la-liga": "/league-logos/la-liga.png",
  "serie-a": "/league-logos/serie-a.png",
  bundesliga: "/league-logos/bundesliga.png",
  "ligue-1": "/league-logos/ligue-1.png",
  "scottish-premiership": "/league-logos/scottish-premiership.png",
  "league-one": "/league-logos/league-one.png",
  "league-two": "/league-logos/league-two.png",
};

const FALLBACK_LEAGUES: League[] = [
  { name: "Premier League", slug: "premier-league" },
  { name: "Championship", slug: "championship" },
  { name: "Scottish Premiership", slug: "scottish-premiership" },
  { name: "La Liga", slug: "la-liga" },
  { name: "Serie A", slug: "serie-a" },
  { name: "Bundesliga", slug: "bundesliga" },
  { name: "Ligue 1", slug: "ligue-1" },
  { name: "League One", slug: "league-one" },
  { name: "League Two", slug: "league-two" },
];

const FALLBACK_COMPETITIONS = [
  "Premier League",
  "Scottish Premiership",
  "Championship",
  "Champions League",
  "Europa League",
  "Conference League",
  "FA Cup",
  "Carabao Cup",
  "Scottish Cup",
  "League Cup",
];

const FALLBACK_CLUBS: Club[] = [
  { name: "Arsenal", slug: "arsenal" },
  { name: "Aston Villa", slug: "aston-villa" },
  { name: "Chelsea", slug: "chelsea" },
  { name: "Liverpool", slug: "liverpool" },
  { name: "Man City", slug: "man-city" },
  { name: "Man United", slug: "man-united" },
  { name: "Everton", slug: "everton" },
  { name: "Barcelona", slug: "barcelona" },
  { name: "Bayern Munich", slug: "bayern-munich" },
  { name: "Celtic", slug: "celtic" },
  { name: "Rangers", slug: "rangers" },
  { name: "Hearts", slug: "hearts" },
  { name: "Hibernian", slug: "hibernian" },
];

const EMOTION_GROUPS = {
  "Anger / Frustration": [
    "FUMING 😡",
    "LIVID 🤬",
    "OUTRAGED 😤",
    "INFURIATED 🔥",
    "FURIOUS 😠",
    "ANNOYED 😒",
    "INCENSED 💢",
    "FRUSTRATED 😣",
    "BITTER 😾",
    "MIFFED 😤",
  ],
  "Disappointment / Sadness": [
    "GUTTED 😞",
    "HEARTBROKEN 💔",
    "CRESTFALLEN 😔",
    "DEJECTED 🙁",
    "MISERABLE 😩",
    "DOWNCAST 😓",
    "DESPONDENT 😖",
    "WOEFUL 😭",
    "MELANCHOLY 😢",
    "RESIGNED 🫠",
  ],
  "Happiness / Joy": [
    "ELATED 😁",
    "EUPHORIC 🥳",
    "JUBILANT 🎉",
    "OVERJOYED 😆",
    "THRILLED 😃",
    "TRIUMPHANT 🏆",
    "ECSTATIC 🤩",
    "CHEERFUL 😄",
    "SATISFIED 😊",
    "RELIEVED 😌",
  ],
  "Disbelief / Surprise": [
    "STUNNED 😳",
    "SPEECHLESS 😶",
    "SHOCKED 😱",
    "FLABBERGASTED 🤯",
    "DUMBFOUNDED 😯",
    "GOBSMACKED 😮",
    "BAFFLED 😵",
    "BEWILDERED 🙁",
    "DAZED 🤔",
    "OVERCOME 😟",
  ],
};

const POPULAR_EMOTIONS = [
  "GUTTED 😞",
  "FUMING 😡",
  "LIVID 🤬",
  "HEARTBROKEN 💔",
  "ELATED 😁",
  "STUNNED 😳",
];

function titleCase(value: string) {
  return value
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function emotionWord(value: string) {
  return value.trim();
}

function getCreatorUrl(creator?: Creator) {
  return creator?.url || creator?.youtube_url || creator?.channel_url || "";
}

function leagueShortName(name: string) {
  const map: Record<string, string> = {
    "Premier League": "PL",
    Championship: "CH",
    "Scottish Premiership": "SP",
    "La Liga": "LL",
    "Serie A": "SA",
    Bundesliga: "BL",
    "Ligue 1": "L1",
    "League One": "L1",
    "League Two": "L2",
  };

  return map[name] || name.slice(0, 3).toUpperCase();
}

function uniqueNames(names: string[]) {
  return Array.from(new Set(names.filter(Boolean)));
}

function canonicalClubName(name: string) {
  const map: Record<string, string> = {
    "Multi Club / Other": MULTI_CLUB_OPTION,
    "Multi-Club/Other": MULTI_CLUB_OPTION,
    "Multi-Club / Other": MULTI_CLUB_OPTION,
    "Brighton & Hove Albion": "Brighton",
    "Man City": "Man City",
    "Manchester City": "Man City",
    "Man United": "Man United",
    "Manchester United": "Man United",
    "Newcastle United": "Newcastle",
    "Nottm Forest": "Nottingham Forest",
    "Spurs": "Tottenham",
    "Tottenham Hotspur": "Tottenham",
    "West Ham United": "West Ham",
    "Wolves": "Wolverhampton Wanderers",
  };

  return map[name.trim()] || name.trim();
}

function uniqueClubNames(names: string[]) {
  const seen = new Set<string>();

  return names
    .map(canonicalClubName)
    .filter((name) => {
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    });
}

function keepSelectedOption(options: string[], selectedValue: string) {
  const uniqueOptions = uniqueClubNames(options);
  const selected = selectedValue ? canonicalClubName(selectedValue) : "";

  if (selected && !uniqueOptions.includes(selected)) {
    return [selected, ...uniqueOptions];
  }

  return uniqueOptions;
}

function creatorMatchesTeam(creator: Creator, team: string, club?: Club) {
  if (!isRealCreator(creator)) return false;

  const selectedTeam = canonicalClubName(team);

  if (selectedTeam === MULTI_CLUB_OPTION) {
    return (
      canonicalClubName(creator.club_name || "") === MULTI_CLUB_OPTION ||
      canonicalClubName(creator.club || "") === MULTI_CLUB_OPTION ||
      canonicalClubName(creator.league || "") === MULTI_CLUB_OPTION
    );
  }

  return (
    canonicalClubName(creator.club_name || "") === selectedTeam ||
    canonicalClubName(creator.club || "") === selectedTeam ||
    creator.club_slug === club?.slug ||
    creator.club_id === club?.id
  );
}

function isPlaceholderCreator(creator: Partial<Creator>) {
  const slug = String(creator.slug || "").trim().toLowerCase();
  const name = String(creator.name || "").trim().toLowerCase();

  return slug === "multi-club-other" || name === "multi-club / other";
}

function isRealCreator(creator: Partial<Creator>) {
  const name = String(creator.name || "").trim();

  return Boolean(name) && !isPlaceholderCreator(creator);
}

function teamLabelWithCreatorCount(team: string, creators: Creator[], clubs: Club[]) {
  const selectedTeam = canonicalClubName(team);
  const club = clubs.find((item) => canonicalClubName(item.name) === selectedTeam);
  const count = creators
    .filter(isRealCreator)
    .filter((creator) => creatorMatchesTeam(creator, selectedTeam, club)).length;

  return `${selectedTeam} (${count})`;
}

export default function GeneratorPage() {
  const [videoType, setVideoType] = useState<VideoType>("Fan Reactions");

  const [leagues, setLeagues] = useState<League[]>(FALLBACK_LEAGUES);
  const [clubs, setClubs] = useState<Club[]>(FALLBACK_CLUBS);
  const [creators, setCreators] = useState<Creator[]>([]);

  const [leagueFilter, setLeagueFilter] = useState("all");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [competition, setCompetition] = useState("Premier League");
  const [emotion, setEmotion] = useState("");

  const [events, setEvents] = useState<
    { type: EventType; time: string; label: string; note: string }[]
  >([]);

  const [creatorTeam, setCreatorTeam] = useState("");
  const [creatorCount, setCreatorCount] = useState(3);
  const [featuredChannels, setFeaturedChannels] = useState<FeaturedChannel[]>([]);

  const [personName, setPersonName] = useState("");
  const [signingEventType, setSigningEventType] = useState<
    "Signing" | "Sacking" | "Departure"
  >("Signing");

  const [generated, setGenerated] = useState(false);

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: "",
    x: "",
    youtube: "",
    tiktok: "",
    website: "",
  });

  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    { label: "", url: "" },
  ]);

  useEffect(() => {
    async function loadData() {
      const [leagueRes, clubRes, creatorRes] = await Promise.all([
        supabase.from("leagues").select("*").order("name"),
        supabase.from("clubs").select("id,name,slug,league,country").limit(500),
        supabase.from("creators").select("*").order("name"),
      ]);

      if (leagueRes.data?.length) setLeagues(leagueRes.data as League[]);
      if (clubRes.data?.length) setClubs(clubRes.data as Club[]);
      if (creatorRes.data?.length) {
        setCreators((creatorRes.data as Creator[]).filter(isRealCreator));
      }
    }

    loadData();
  }, []);

  const competitions = useMemo(() => {
    const names = leagues.map((league) => league.name);
    return Array.from(new Set([...names, ...FALLBACK_COMPETITIONS]));
  }, [leagues]);

  const orderedLeagues = useMemo(() => {
    return [...leagues].sort((a, b) => {
      const aIndex = LEAGUE_ORDER.indexOf(a.slug);
      const bIndex = LEAGUE_ORDER.indexOf(b.slug);

      if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });
  }, [leagues]);

  const filteredClubs = useMemo(() => {
    const normalise = (value?: string | null) =>
      (value || "")
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const sortedClubs = [...clubs].sort((a, b) => {
      const leagueA = a.league_name || a.league || "";
      const leagueB = b.league_name || b.league || "";

      if (leagueA !== leagueB) {
        return leagueA.localeCompare(leagueB);
      }

      return a.name.localeCompare(b.name);
    });

    if (leagueFilter === "all") {
      return sortedClubs;
    }

    const selectedLeague = leagues.find((league) => league.slug === leagueFilter);
    const selectedLeagueName = selectedLeague?.name || "";
    const selectedLeagueId = selectedLeague?.id || "";

    return sortedClubs.filter((club) => {
      const clubLeagueName = club.league_name || club.league || "";
      const clubLeagueSlug = club.league_slug || normalise(clubLeagueName);

      return (
        clubLeagueSlug === leagueFilter ||
        normalise(club.league) === leagueFilter ||
        normalise(club.league_name) === leagueFilter ||
        clubLeagueName === selectedLeagueName ||
        club.league_id === selectedLeagueId
      );
    });
  }, [clubs, leagues, leagueFilter]);

  const clubNames = useMemo(
    () => uniqueClubNames(filteredClubs.map((club) => club.name)),
    [filteredClubs]
  );

  const allClubNames = useMemo(
    () => uniqueClubNames([...clubs].sort((a, b) => a.name.localeCompare(b.name)).map((club) => club.name)),
    [clubs]
  );

  const homeTeamOptions = useMemo(
    () => keepSelectedOption(clubNames, homeTeam),
    [clubNames, homeTeam]
  );

  const awayTeamOptions = useMemo(
    () => keepSelectedOption(clubNames, awayTeam),
    [clubNames, awayTeam]
  );

  const creatorTeamOptions = useMemo(() => {
    return keepSelectedOption([MULTI_CLUB_OPTION, ...clubNames], creatorTeam);
  }, [clubNames, creatorTeam]);

  const creatorTeamSelectOptions = useMemo<SelectOption[]>(() => {
    return creatorTeamOptions.map((team) => ({
      value: canonicalClubName(team),
      label: teamLabelWithCreatorCount(team, creators, clubs),
    }));
  }, [creatorTeamOptions, creators, clubs]);

  useEffect(() => {
    if (homeTeam && !allClubNames.includes(homeTeam)) setHomeTeam("");
    if (awayTeam && !allClubNames.includes(awayTeam)) setAwayTeam("");
    if (creatorTeam && creatorTeam !== MULTI_CLUB_OPTION && !allClubNames.includes(creatorTeam)) {
      setCreatorTeam("");
    }
  }, [allClubNames, homeTeam, awayTeam, creatorTeam]);

  const creatorOptionsForTeam = useMemo(() => {
    if (!creatorTeam) return creators;

    const selectedClub = clubs.find(
      (club) => canonicalClubName(club.name) === canonicalClubName(creatorTeam)
    );

    const matched = creators.filter(isRealCreator).filter((creator) =>
      creatorMatchesTeam(creator, creatorTeam, selectedClub)
    );

    return matched.length ? matched : creators;
  }, [creatorTeam, clubs, creators]);

  const liveTitle = useMemo(() => {
    if (videoType === "Signing / Sacking") {
      const team = homeTeam || "Club";
      const person = titleCase(personName || "Manager");
      const action =
        signingEventType === "Signing"
          ? "SIGNING"
          : signingEventType === "Sacking"
            ? "SACKED"
            : "DEPARTURE";

      return `${team} Fans ${emotionWord(emotion) || "STUNNED 😳"} as ${person} ${action} | ${competition} Fan Reactions`;
    }

    if (!homeTeam || !awayTeam) return "";

    if (videoType === "Mixed Fans") {
      return `${homeTeam} and ${awayTeam} Fans ${emotionWord(emotion) || "REACT"} to ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} | ${competition} Fan Reactions`;
    }

    if (videoType === "Rivals & Haters") {
      return `${homeTeam}'s Rivals & Haters ${emotionWord(emotion) || "REACT"} to ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} | ${competition} Fan Reactions`;
    }

    if (videoType === "Post-Match") {
      return `${homeTeam} & ${awayTeam} Fans ${emotionWord(emotion) || "REACT"} Post-Match Reactions | ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} | ${competition}`;
    }

    return `${homeTeam} Fans ${emotionWord(emotion) || "REACT"} Reactions to ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} | ${competition} Fan Reactions`;
  }, [
    videoType,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    competition,
    emotion,
    personName,
    signingEventType,
  ]);

  const timestampText = useMemo(() => {
    const lines = ["00:00 – Introduction"];

    events.forEach((event) => {
      lines.push(
        `${event.time || "00:00"} – ${event.label}${event.note ? ` — ${event.note}` : ""}`
      );
    });

    return lines.join("\n");
  }, [events]);

  const channelCredits = useMemo(() => {
    if (!featuredChannels.length) return "⚽ Add channel credits above";

    return featuredChannels
      .map((row) => {
        return `⚽ ${row.creator}${row.url ? ` — ${row.url}` : ""}`;
      })
      .join("\n");
  }, [featuredChannels]);

  const socialLinksText = useMemo(() => {
    const rows = [
      socialLinks.instagram.trim() ? `📸 Instagram: ${socialLinks.instagram.trim()}` : "",
      socialLinks.x.trim() ? `🔎 X / Twitter: ${socialLinks.x.trim()}` : "",
      socialLinks.youtube.trim() ? `▶️ YouTube: ${socialLinks.youtube.trim()}` : "",
      socialLinks.tiktok.trim() ? `🎵 TikTok: ${socialLinks.tiktok.trim()}` : "",
      socialLinks.website.trim() ? `🌐 Website: ${socialLinks.website.trim()}` : "",
    ].filter(Boolean);

    return rows.length ? rows.join("\n") : "Add your social links above.";
  }, [socialLinks]);

  const affiliateLinksText = useMemo(() => {
    const rows = affiliateLinks
      .map((link) => {
        const label = link.label.trim();
        const url = link.url.trim();

        if (!label && !url) return "";
        if (label && url) return `🔗 ${label}: ${url}`;
        return `🔗 ${label || url}`;
      })
      .filter(Boolean);

    return rows.length ? rows.join("\n") : "No affiliate links added.";
  }, [affiliateLinks]);

  const creatorPromotionText = useMemo(() => {
    return `🔗 CREATOR LINKS / AFFILIATES
${affiliateLinksText}

🔔 Subscribe for more football fan reaction compilations.

${socialLinksText}`;
  }, [affiliateLinksText, socialLinksText]);

  const description = useMemo(() => {
    if (videoType === "Signing / Sacking") {
      const team = homeTeam || "Club";
      const person = titleCase(personName || "the news");
      const action =
        signingEventType === "Signing"
          ? `signing ${person}`
          : signingEventType === "Sacking"
            ? `${person} being sacked from ${team}`
            : `${person} leaving ${team}`;

      return `${team} fans react to ${action}. Every emotion, every take, unfiltered — this is what it means to be a football fan when the news breaks.

📺 FAN CHANNELS IN THIS VIDEO
Show some love — subscribe to the creators who appear:
${channelCredits}

—

${creatorPromotionText}`;
    }

    if (videoType === "Rivals & Haters") {
      const losingTeam = homeScore < awayScore ? homeTeam : awayTeam;
      const winner = homeScore > awayScore ? homeTeam : awayTeam;

      return `Rival fans react to ${losingTeam}'s ${homeScore}-${awayScore} ${winner} result — and they are absolutely loving every second of it. Watch rival supporters celebrate, mock, and react as the match unfolds. Pure football chaos.

⏱️ TIMESTAMPS
${timestampText}

📺 FAN CHANNELS IN THIS VIDEO
Show some love — subscribe to the creators who appear:
${channelCredits}

—

${creatorPromotionText}`;
    }

    if (videoType === "Mixed Fans") {
      return `${homeTeam} and ${awayTeam} fans react to ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} — every goal, every moment, every emotion from both sides. Watch die-hard supporters from both clubs experience every goal, every near-miss, and every heart-stopping moment of this ${competition} match in real time.

⏱️ TIMESTAMPS
${timestampText}

📺 FAN CHANNELS IN THIS VIDEO
Show some love — subscribe to the creators who appear:
${channelCredits}

—

${creatorPromotionText}`;
    }

    if (videoType === "Post-Match") {
      return `${homeTeam} ${homeScore}-${awayScore} ${awayTeam} — post-match fan reactions. Watch ${homeTeam} and ${awayTeam} fans process what just happened. The highs, the lows, the disbelief, the fury — unfiltered and in real time.

⏱️ TIMESTAMPS
${timestampText}

📺 FAN CHANNELS IN THIS VIDEO
Show some love — subscribe to the creators who appear:
${channelCredits}

—

${creatorPromotionText}`;
    }

    return `${homeTeam} fans react to ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} — every goal, every moment, every emotion. Watch die-hard ${homeTeam} supporters experience every goal, every near-miss, and every heart-stopping moment of this ${competition} match in real time. From pure ecstasy to absolute heartbreak — this is what football means to real fans.

⏱️ TIMESTAMPS
${timestampText}

📺 FAN CHANNELS IN THIS VIDEO
Show some love — subscribe to the creators who appear:
${channelCredits}

—

${creatorPromotionText}`;
  }, [
    videoType,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    competition,
    timestampText,
    channelCredits,
    creatorPromotionText,
    personName,
    signingEventType,
  ]);

  const tags = useMemo(() => {
    if (videoType === "Signing / Sacking") {
      const person = titleCase(personName || "");
      return [
        `${homeTeam} Fan Reaction`,
        `${person} ${homeTeam}`,
        `${homeTeam} ${signingEventType.toLowerCase()}`,
        `${person} reaction`,
        "Football Transfer Reaction",
        `${competition} Transfer`,
        `${homeTeam} fans`,
        `${person}`,
        "football fan reactions",
        "football news reaction",
        "fan reactions football",
        "fan reactions compilation",
      ]
        .filter(Boolean)
        .join(", ");
    }

    if (videoType === "Rivals & Haters") {
      return [
        "Rival Fans React",
        `${homeTeam} Fan Reactions`,
        "Rivals React",
        "Haters React",
        `${homeTeam} ${homeScore}-${awayScore} ${awayTeam}`,
        `${competition} Rivals Reactions`,
        "Football Schadenfreude",
        `Rival reaction to ${homeTeam}`,
        "Premier League Rivals Reactions",
        "fan reactions",
        "rivals and haters",
        "football fan reactions",
        `${homeTeam} ${awayTeam} reaction`,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return [
      `${homeTeam} Fan Reaction`,
      `${homeTeam} Fans React`,
      `${awayTeam} Fan Reaction`,
      `${homeTeam} vs ${awayTeam}`,
      `${homeTeam} ${homeScore}-${awayScore} ${awayTeam}`,
      `${competition} Fan Reactions`,
      "Football Fan Reactions",
      `${homeTeam} goal reaction`,
      `${homeTeam} watchalong`,
      "Premier League Fan Reactions",
      "Champions League Fan Reactions",
      "fan reactions football",
      `${homeTeam} fans ${emotion.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim().toLowerCase()}`,
      `${awayTeam} fan reaction`,
      "fan reactions compilation",
      "football reactions",
    ]
      .filter(Boolean)
      .join(", ");
  }, [
    videoType,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    competition,
    emotion,
    personName,
    signingEventType,
  ]);

  function scorelineLabel(homeGoals: number, awayGoals: number) {
    return `${homeTeam || "Home"} ${homeGoals}-${awayGoals} ${awayTeam || "Away"}`;
  }

  function addEvent(type: EventType) {
    const currentHomeScore = Number(homeScore) || 0;
    const currentAwayScore = Number(awayScore) || 0;

    const labelMap: Record<EventType, string> = {
      home_goal: scorelineLabel(currentHomeScore, currentAwayScore),
      away_goal: scorelineLabel(currentHomeScore, currentAwayScore),
      red_card: "Red Card",
      var: "VAR",
      penalty: "Penalty",
      custom: "Custom Event",
    };

    setEvents((prev) => [
      ...prev,
      {
        type,
        time: "00:00",
        label: labelMap[type],
        note: "",
      },
    ]);
  }

  function addFeaturedChannels() {
    if (!creatorTeam) return;

    const rows = creatorOptionsForTeam.filter(isRealCreator).slice(0, creatorCount).map((creator) => ({
      team: creatorTeam,
      creator: creator.name,
      url: getCreatorUrl(creator),
    }));

    setFeaturedChannels((prev) => [...prev, ...rows]);
  }

  function updateFeaturedRow(index: number, key: "team" | "creator", value: string) {
    setFeaturedChannels((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };

      if (key === "team") {
        const selectedTeam = canonicalClubName(value);
        const club = clubs.find((item) => canonicalClubName(item.name) === selectedTeam);

        const matchedCreators = creators.filter((creator) =>
          creatorMatchesTeam(creator, selectedTeam, club)
        );

        const firstCreator = matchedCreators[0] || creators[0];
        copy[index].team = selectedTeam;
        copy[index].creator = firstCreator?.name || "";
        copy[index].url = getCreatorUrl(firstCreator);
      }

      if (key === "creator") {
        const creator = creators.find((item) => item.name === value);
        copy[index].url = getCreatorUrl(creator);
      }

      return copy;
    });
  }

  function addManualChannel() {
    setFeaturedChannels((prev) => [
      ...prev,
      {
        team: creatorTeam || homeTeam || clubs[0]?.name || "",
        creator: creators[0]?.name || "",
        url: getCreatorUrl(creators[0]),
      },
    ]);
  }

  function updateSocialLink(key: keyof SocialLinks, value: string) {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  }

  function updateAffiliateLink(index: number, key: keyof AffiliateLink, value: string) {
    setAffiliateLinks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  function addAffiliateLink() {
    setAffiliateLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeAffiliateLink(index: number) {
    setAffiliateLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function generateContent() {
    const errors = [];

    if (!homeTeam) errors.push("Home team is missing");
    if (videoType !== "Signing / Sacking" && !awayTeam) errors.push("Away team is missing");
    if (!emotion) errors.push("Emotion / headline word is missing");
    if (videoType === "Signing / Sacking" && !personName.trim()) {
      errors.push("Player / manager name is missing");
    }

    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    setGenerated(true);
    setTimeout(() => {
      document.getElementById("generator-output")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  async function copyAll() {
    await copyText(`${liveTitle}\n\n${description}\n\n${tags}`);
  }

  function newVideo() {
    if (!confirm("Start a new video? All current data will be cleared.")) return;

    setVideoType("Fan Reactions");
    setLeagueFilter("all");
    setHomeTeam("");
    setAwayTeam("");
    setHomeScore(0);
    setAwayScore(0);
    setCompetition("Premier League");
    setEmotion("");
    setEvents([]);
    setCreatorTeam("");
    setCreatorCount(3);
    setFeaturedChannels([]);
    setPersonName("");
    setSigningEventType("Signing");
    setGenerated(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {generated && (
        <div className="sticky top-[98px] z-40 border-b border-[#67e1f9]/20 bg-black/95 px-5 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <p className="text-sm font-black uppercase tracking-widest text-[#67e1f9]">
              ✓ Content Generated
            </p>

            <div className="flex gap-2">
              <button onClick={() => document.getElementById("generator-output")?.scrollIntoView({ behavior: "smooth" })} className="btnSmall">
                View Output
              </button>
              <button onClick={copyAll} className="btnSmall">
                Copy All
              </button>
              <button onClick={newVideo} className="btnSmall">
                New Video
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black md:text-5xl">
            Description <span className="text-[#67e1f9]">Generator</span>
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Title · Description · Tags — copy and paste
          </p>
          <button onClick={newVideo} className="mt-5 rounded-xl border border-[#67e1f9]/30 bg-[#0b1020] px-5 py-2 font-bold text-white hover:border-[#67e1f9]">
            ↻ New Video
          </button>
        </div>

        <Card number="1" title="Video Type">
          <div className="grid gap-3 md:grid-cols-5">
            {(["Fan Reactions", "Mixed Fans", "Rivals & Haters", "Post-Match", "Signing / Sacking"] as VideoType[]).map((type) => (
              <button
                key={type}
                onClick={() => setVideoType(type)}
                className={`rounded-xl border px-4 py-5 text-sm font-black uppercase tracking-wide transition hover:-translate-y-1 hover:border-[#67e1f9] ${
                  videoType === type
                    ? "border-[#67e1f9] bg-[#67e1f9] text-black"
                    : "border-[#67e1f9]/20 bg-[#0b1020] text-slate-300"
                }`}
              >
                {type === "Fan Reactions" && "⚽ "}
                {type === "Mixed Fans" && "🤝 "}
                {type === "Rivals & Haters" && "😈 "}
                {type === "Post-Match" && "🎤 "}
                {type === "Signing / Sacking" && "📰 "}
                {type}
              </button>
            ))}
          </div>
        </Card>

        <Card number="2" title="Match Details">
          <Field label="League">
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setLeagueFilter("all")}
                className={`leagueTab ${leagueFilter === "all" ? "leagueTabActive" : ""}`}
              >
                ALL
              </button>

              {orderedLeagues.map((league) => (
                <button
                  key={league.slug}
                  onClick={() => setLeagueFilter(league.slug)}
                  className={`leagueTab leagueLogoTab ${leagueFilter === league.slug ? "leagueTabActive" : ""}`}
                  title={league.name}
                  aria-label={league.name}
                >
                  {LEAGUE_LOGOS[league.slug] ? (
                    <img
                      src={LEAGUE_LOGOS[league.slug]}
                      alt={league.name}
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    <span>{leagueShortName(league.name)}</span>
                  )}
                  <span className="hidden sm:inline">{leagueShortName(league.name)}</span>
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Home Team">
              <Select value={homeTeam} onChange={(value) => setHomeTeam(canonicalClubName(value))} options={homeTeamOptions} placeholder="Select team..." />
            </Field>

            {videoType !== "Signing / Sacking" && (
              <Field label="Away Team">
                <Select value={awayTeam} onChange={(value) => setAwayTeam(canonicalClubName(value))} options={awayTeamOptions} placeholder="Select team..." />
              </Field>
            )}

            
              <Field label="Home Score">
  <input
    type="number"
    min="0"
    value={homeScore}
    onChange={(e) => setHomeScore(Math.max(0, Number(e.target.value) || 0))}
    className="inputLight"
  />
</Field>

            {videoType !== "Signing / Sacking" && (
              <Field label="Away Score">
                 <input
      type="number"
      min="0"
      value={awayScore}
      onChange={(e) => setAwayScore(Math.max(0, Number(e.target.value) || 0))}
      className="inputLight"
          />
  </Field>
)}
          </div>

          <div className="mt-8">
            <Field label="Emotion / Headline Word">
              <div className="flex gap-3">
                <input value={emotion} onChange={(e) => setEmotion(e.target.value)} placeholder="Type or pick from grid below..." className="inputLight flex-1" />
                <button onClick={() => setEmotion("")} className="btnMuted">
                  × Clear
                </button>
              </div>
            </Field>

            <div className="mt-5 overflow-hidden rounded-xl border border-[#67e1f9]/20">
              <div className="bg-black/30 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#67e1f9]">
                Popular
              </div>
              <div className="grid md:grid-cols-6">
                {POPULAR_EMOTIONS.map((word) => (
                  <EmotionButton key={word} word={word} emotion={emotion} setEmotion={setEmotion} />
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {Object.entries(EMOTION_GROUPS).map(([group, words]) => (
                <div key={group} className="overflow-hidden rounded-xl border border-[#67e1f9]/20">
                  <div className="bg-black/30 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#67e1f9]">
                    {group}
                  </div>
                  <div className="grid grid-cols-2">
                    {words.map((word) => (
                      <EmotionButton key={word} word={word} emotion={emotion} setEmotion={setEmotion} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {videoType === "Signing / Sacking" && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Player / Manager Name">
                <input value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="e.g. Joe Black" className="inputLight" />
              </Field>

              <Field label="Event Type">
                <select value={signingEventType} onChange={(e) => setSigningEventType(e.target.value as "Signing" | "Sacking" | "Departure")} className="inputLight">
                  <option>Signing</option>
                  <option>Sacking</option>
                  <option>Departure</option>
                </select>
              </Field>
            </div>
          )}
        </Card>

        {videoType !== "Signing / Sacking" && (
          <Card number="3" title="Timestamps">
            <div className="rounded-xl bg-black/30 p-4 text-slate-500">
              00:00 — Introduction fixed
            </div>

            <div className="mt-4 space-y-3">
              {events.map((event, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-[#67e1f9]/20 bg-black/30 p-3 md:grid-cols-[100px_1fr_1fr_50px]">
                  <input
                    value={event.time}
                    onChange={(e) => {
                      const copy = [...events];
                      copy[index].time = e.target.value;
                      setEvents(copy);
                    }}
                    className="inputLight font-black"
                  />

                  <input
                    value={event.label}
                    onChange={(e) => {
                      const copy = [...events];
                      copy[index].label = e.target.value;
                      setEvents(copy);
                    }}
                    className="inputLight font-black"
                  />

                  <input
                    value={event.note}
                    placeholder="Optional note..."
                    onChange={(e) => {
                      const copy = [...events];
                      copy[index].note = e.target.value;
                      setEvents(copy);
                    }}
                    className="inputLight"
                  />

                  <button onClick={() => setEvents(events.filter((_, i) => i !== index))} className="rounded-xl border border-red-500/30 bg-red-500/10 font-black text-red-300">
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <EventButton onClick={() => addEvent("home_goal")}>⚽ {homeTeam || "Home"} Goal</EventButton>
              <EventButton onClick={() => addEvent("away_goal")}>⚽ {awayTeam || "Away"} Goal</EventButton>
              <EventButton onClick={() => addEvent("red_card")}>🟥 Red Card</EventButton>
              <EventButton onClick={() => addEvent("var")}>📺 VAR</EventButton>
              <EventButton onClick={() => addEvent("penalty")}>🎯 Penalty</EventButton>
              <EventButton onClick={() => addEvent("custom")}>+ Custom</EventButton>
            </div>
          </Card>
        )}

        <Card number={videoType === "Signing / Sacking" ? "3" : "4"} title="Featured YouTube Channels">
          <div className="grid gap-3 md:grid-cols-[1fr_120px_120px]">
            <OptionSelect
              value={creatorTeam}
              onChange={(value) => setCreatorTeam(canonicalClubName(value))}
              options={creatorTeamSelectOptions}
              placeholder="Select team from selected league..."
            />
            <input type="number" value={creatorCount} onChange={(e) => setCreatorCount(Number(e.target.value))} className="inputLight" />
            <button onClick={addFeaturedChannels} disabled={!creatorTeam} className="btnPrimary disabled:opacity-40">
              Add
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {featuredChannels.length === 0 ? (
              <p className="text-slate-400">No channels added yet — use the quick-add above or add manually.</p>
            ) : (
              featuredChannels.map((row, index) => {
                const selectedRowTeam = canonicalClubName(row.team);
                const rowClub = clubs.find((club) => canonicalClubName(club.name) === selectedRowTeam);
                const matchedCreators = creators.filter((creator) =>
                  creatorMatchesTeam(creator, selectedRowTeam, rowClub)
                );

                const channelOptions = matchedCreators.length ? matchedCreators : creators.filter(isRealCreator);
                const rowTeamSelectOptions: SelectOption[] = keepSelectedOption(
                  [MULTI_CLUB_OPTION, ...clubNames],
                  row.team
                ).map((team) => ({
                  value: canonicalClubName(team),
                  label: teamLabelWithCreatorCount(team, creators, clubs),
                }));

                return (
                  <div key={index} className="grid gap-3 rounded-xl border border-[#67e1f9]/20 bg-black/30 p-3 md:grid-cols-[1fr_1fr_45px_45px]">
                    <OptionSelect
                      value={row.team}
                      onChange={(value) => updateFeaturedRow(index, "team", value)}
                      options={rowTeamSelectOptions}
                    />
                    <Select value={row.creator} onChange={(value) => updateFeaturedRow(index, "creator", value)} options={channelOptions.map((creator) => creator.name)} placeholder="Select channel..." />

                    <a href={row.url || "#"} target="_blank" rel="noopener noreferrer" className="grid place-items-center rounded-xl border border-[#67e1f9]/20 bg-black/30 font-black text-[#67e1f9]">
                      ↗
                    </a>

                    <button onClick={() => setFeaturedChannels(featuredChannels.filter((_, i) => i !== index))} className="rounded-xl border border-red-500/30 bg-red-500/10 font-black text-red-300">
                      ×
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <button onClick={addManualChannel} className="mt-4 rounded-xl border border-dashed border-[#67e1f9]/30 bg-[#67e1f9]/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-[#67e1f9] hover:bg-[#67e1f9] hover:text-black">
            + Add Channel Manually
          </button>
        </Card>

        <Card number={videoType === "Signing / Sacking" ? "4" : "5"} title="Social & Affiliate Links">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Instagram">
              <input
                value={socialLinks.instagram}
                onChange={(e) => updateSocialLink("instagram", e.target.value)}
                placeholder="https://www.instagram.com/yourname"
                className="inputLight"
              />
            </Field>

            <Field label="X / Twitter">
              <input
                value={socialLinks.x}
                onChange={(e) => updateSocialLink("x", e.target.value)}
                placeholder="https://x.com/yourname"
                className="inputLight"
              />
            </Field>

            <Field label="YouTube">
              <input
                value={socialLinks.youtube}
                onChange={(e) => updateSocialLink("youtube", e.target.value)}
                placeholder="https://www.youtube.com/@yourchannel"
                className="inputLight"
              />
            </Field>

            <Field label="TikTok">
              <input
                value={socialLinks.tiktok}
                onChange={(e) => updateSocialLink("tiktok", e.target.value)}
                placeholder="https://www.tiktok.com/@yourname"
                className="inputLight"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Website">
                <input
                  value={socialLinks.website}
                  onChange={(e) => updateSocialLink("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="inputLight"
                />
              </Field>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 text-xs font-black uppercase tracking-widest text-[#67e1f9]">
              Affiliate Links
            </div>

            <div className="space-y-3">
              {affiliateLinks.map((link, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-[#67e1f9]/20 bg-black/30 p-3 md:grid-cols-[1fr_1.5fr_45px]">
                  <input
                    value={link.label}
                    onChange={(e) => updateAffiliateLink(index, "label", e.target.value)}
                    placeholder="Label, e.g. Shirt discount"
                    className="inputLight"
                  />

                  <input
                    value={link.url}
                    onChange={(e) => updateAffiliateLink(index, "url", e.target.value)}
                    placeholder="Affiliate URL"
                    className="inputLight"
                  />

                  <button
                    onClick={() => removeAffiliateLink(index)}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 font-black text-red-300 hover:bg-red-500 hover:text-white"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addAffiliateLink}
              className="mt-4 rounded-xl border border-dashed border-[#67e1f9]/40 bg-[#67e1f9]/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-[#67e1f9] hover:bg-[#67e1f9] hover:text-black"
              type="button"
            >
              + Add Affiliate Link
            </button>
          </div>
        </Card>

        <Card number={videoType === "Signing / Sacking" ? "5" : "6"} title="Live Title Preview">
          <div className="rounded-2xl border border-[#67e1f9]/40 bg-black/30 p-5 text-xl font-black text-white">
            {liveTitle || "Your generated title will appear here..."}
          </div>
        </Card>

        <button onClick={generateContent} className="mb-8 w-full rounded-2xl bg-[#67e1f9] px-8 py-5 text-xl font-black text-black hover:bg-white">
          ⚡ Generate Title, Description & Tags
        </button>

        {generated && (
          <section id="generator-output" className="space-y-6 rounded-3xl border border-[#67e1f9]/25 bg-[#07101f] p-6">
            <div className="flex justify-end">
              <button onClick={copyAll} className="rounded-xl bg-[#67e1f9] px-6 py-3 font-black uppercase tracking-widest text-black">
                ↓ Copy All To Clipboard
              </button>
            </div>

            <Output title={`Title (${liveTitle.length}/100)`} text={liveTitle} onCopy={copyText} />
            <Output title="Description" text={description} onCopy={copyText} large />
            <Output title={`Tags (${tags.length}/500 chars)`} text={tags} onCopy={copyText} />
          </section>
        )}
      </section>

      <style jsx global>{`
        .inputLight {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(103, 225, 249, 0.22);
          background: #050914;
          padding: 0.9rem 1rem;
          color: #ffffff;
          outline: none;
        }

        .inputLight::placeholder {
          color: #7c879a;
        }

        .inputLight:focus {
          border-color: #67e1f9;
          box-shadow: 0 0 0 3px rgba(103, 225, 249, 0.2);
        }

        .btnMuted,
        .btnSmall {
          border-radius: 0.75rem;
          border: 1px solid rgba(103, 225, 249, 0.25);
          background: #0b1020;
          padding: 0.85rem 1rem;
          font-weight: 900;
          color: #d8e1ef;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .btnMuted:hover,
        .btnSmall:hover {
          border-color: #67e1f9;
          color: #67e1f9;
        }

        .btnSmall {
          padding: 0.55rem 1rem;
          font-size: 0.8rem;
        }

        .btnPrimary {
          border-radius: 0.75rem;
          background: #67e1f9;
          padding: 0.85rem 1rem;
          font-weight: 900;
          color: #000000;
          text-transform: uppercase;
        }

        .leagueTab {
          display: inline-flex;
          min-height: 3.35rem;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 999px;
          border: 1px solid rgba(103, 225, 249, 0.25);
          background: #0b1020;
          padding: 0.7rem 1rem;
          font-size: 0.85rem;
          font-weight: 900;
          color: #d8e1ef;
        }

        .leagueLogoTab {
          min-width: 5.25rem;
        }

        .leagueTabActive {
          border-color: #67e1f9;
          background: #67e1f9;
          color: #000000;
        }
      `}</style>
    </main>
  );
}

function Card({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 rounded-2xl border border-[#67e1f9]/20 bg-[#07101f] p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#67e1f9] text-sm font-black text-black">
          {number}
        </span>
        <h2 className="text-lg font-black uppercase tracking-widest text-[#67e1f9]">
          {title}
        </h2>
        <div className="h-px flex-1 bg-[#67e1f9]/20" />
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </div>
      {children}
    </label>
  );
}

function OptionSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}) {
  const safeOptions = options.filter(
    (option, index, array) =>
      option.value &&
      array.findIndex((item) => item.value === option.value) === index
  );

  const visibleOptions =
    value && !safeOptions.some((option) => option.value === value)
      ? [{ value, label: value }, ...safeOptions]
      : safeOptions;

  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="inputLight">
      {placeholder && <option value="">{placeholder}</option>}
      {visibleOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const safeOptions = uniqueNames(options.filter(Boolean));
  const visibleOptions = value && !safeOptions.includes(value)
    ? [value, ...safeOptions]
    : safeOptions;

  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="inputLight">
      {placeholder && <option value="">{placeholder}</option>}
      {visibleOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function EmotionButton({
  word,
  emotion,
  setEmotion,
}: {
  word: string;
  emotion: string;
  setEmotion: (value: string) => void;
}) {
  return (
    <button
      onClick={() => setEmotion(word)}
      className={`border border-[#67e1f9]/20 px-4 py-3 text-left font-bold transition hover:bg-[#67e1f9] hover:text-black ${
        emotion === word ? "bg-[#67e1f9] text-black" : "bg-[#050914] text-slate-300"
      }`}
    >
      {word}
    </button>
  );
}

function EventButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="btnMuted hover:border-[#67e1f9] hover:text-[#67e1f9]">
      {children}
    </button>
  );
}

function Output({
  title,
  text,
  large,
  onCopy,
}: {
  title: string;
  text: string;
  large?: boolean;
  onCopy: (text: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-black uppercase tracking-widest text-[#67e1f9]">
          {title}
        </h3>
        <button onClick={() => onCopy(text)} className="btnMuted">
          Copy
        </button>
      </div>

      <pre className={`whitespace-pre-wrap rounded-xl border border-[#67e1f9]/20 bg-black/40 p-5 text-slate-300 ${large ? "min-h-[260px]" : ""}`}>
        {text}
      </pre>
    </div>
  );
}