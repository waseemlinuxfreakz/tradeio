import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  Globe,
  ChevronRight,
  User,
  AtSign,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  TrendingUp,
  BarChart2,
  Scale,
  PieChart,
} from "lucide-react";
import { message, Spin } from "antd";
import NavigationBar from "../components/NavigationBar";
import { postUploadUserImage } from "../apis/apiEndpoints";
import { getDecodedUserToken } from "../utils";
import { UserImage } from "../types/auth";
import { updateUserProfile } from "../apis/apiEndpoints";
import useUserDetials from "../hooks/useUserDetails";
import FullPageLoader from "../components/Loader";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [profileCompletion, setProfileCompletion] = useState(50);
  const [loading, setLoading] = useState(false);
  const user = getDecodedUserToken();
  const { userDetails, userDetialsLoading } = useUserDetials(user!?.userId);
  const userData = userDetails?.data?.data?.userWithoutPassword;

  const [profile, setProfile] = useState<{
    photo: string | null;
    about: string;
    walletAddress: string;
    displayName: string;
    telegram: string;
  }>({
    photo: userData!?.image,
    about: userData?.about_me || "",
    walletAddress: "wallet_address",
    displayName: userData?.name || "",
    telegram: "@username",
  });
  const [tradingPreferences, setTradingPreferences] = useState({
    riskRewardRatio: `${
      userData?.riskRewardRation
        ? userData?.riskRewardRation?.toLowerCase()
        : "medium"
    }`,
    riskProfile: "medium",
    swingDayScalp: `${
      userData?.tradingStyle ? userData?.tradingStyle?.toLowerCase() : "day"
    }`,
    minimalConsensus: "medium",
    minimalAnalystRating: "medium",
    investmentSegment: "medium",
    topic: "medium",
    timeToCreation: "medium",
    swingScalp: "medium",
    spotFuturesOptions: `${
      userData?.assetType ? userData?.assetType?.toLowerCase() : "spot"
    }`,
    dexCexExchange: `${
      userData?.exchangeType ? userData?.exchangeType?.toLowerCase() : "dex"
    }`,
    shortLong: `${
      userData?.positionType ? userData?.positionType?.toLowerCase() : "both"
    }`,
  });
  const [communication, setCommunication] = useState({
    language: "English",
    linkedAccounts: {
      instagram: "",
      facebook: "",
      telegram: "",
      twitter: "",
    },
  });
  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setProfile: React.Dispatch<
      React.SetStateAction<{
        photo: string | null;
        about: string;
        walletAddress: string;
        displayName: string;
        telegram: string;
      }>
    >
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, photo: previewURL }));
    setLoading(true);
    try {
      const uploadedImage: UserImage = await postUploadUserImage(file);
      // setProfile((prev) => ({ ...prev, photo: uploadedImage.imageUrl }));
      const freshImageUrl = `${uploadedImage.imageUrl}?${Date.now()}`;
      setProfile((prev) => ({ ...prev, photo: freshImageUrl }));
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = () => {
    const payload = {
      image: profile.photo ?? "",
      about_me: profile.about,
      name: profile?.displayName ?? "",
      riskRewardRation: tradingPreferences.riskRewardRatio.toUpperCase(),
      tradingStyle: tradingPreferences.swingDayScalp.toUpperCase(),
      assetType: tradingPreferences.spotFuturesOptions.toUpperCase(),
      exchangeType: tradingPreferences.dexCexExchange.toUpperCase(),
      positionType: tradingPreferences.shortLong.toUpperCase(),
    };
    setLoading(true);

    updateUserProfile(payload)
      .then((response) => {
        if (response.status === 200) {
          message.success("Profile updated successfully");
          // setProfile((prev) => ({ ...prev, about: "" }));
          localStorage.removeItem("token");
          localStorage.setItem("token", response.data.token);
        } else if (response?.data.error) {
          message.error(response?.data.error);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.error) {
          message.error(error.response.data.error, 2);
          return;
        }
        message.error("Something went wrong", 2);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (userDetialsLoading) {
    <FullPageLoader loading={userDetialsLoading} />;
  }
  useEffect(() => {
    if (userData) {
      setProfile((prev) => ({
        ...prev,
        photo: userData?.image || "",
        about: userData?.about_me || "",
        displayName: userData?.name || "",
      }));
    }
  }, [userData]);
  return (
    <Spin spinning={loading}>
      <div className="bg-slate-900 min-h-screen text-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-4 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Settings</h1>
          </div>
        </div>

        {/* Profile Completion */}
        {/* <div className="p-4">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm text-slate-400">
              Profile completion: {profileCompletion}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div> */}

        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Photos Section */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <h2 className="font-semibold mb-2">Photos</h2>
            <p className="text-sm text-slate-400 mb-4">
              The main photo is how you appear to others on the signal view
            </p>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      referrerPolicy="no-referrer"
                      alt="Profile"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-500" />
                  )}
                </div>
              </div>
              <label className="cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProfileImageUpload(e, setProfile)}
                  className="hidden"
                />
              </label>
            </div>
            {/* </div>

				<div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50"> */}
            <div className="mt-5 mb-2">
              <h2 className="font-semibold mb-2">Name</h2>
              <input
                className="w-full bg-slate-700/50 rounded-lg p-3 text-sm"
                placeholder="Share a few words about yourself..."
                value={profile.displayName}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-5 mb-2">
              <h2 className="font-semibold mb-2">About me</h2>
              <p className="text-sm text-slate-400 mb-1">
                Make it easy for others to get a sense of who you are
              </p>
              <textarea
                className="w-full bg-slate-700/50 rounded-lg p-3 text-sm"
                placeholder="Share a few words about yourself..."
                rows={4}
                value={profile.about}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, about: e.target.value }))
                }
              />
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">Risk/Reward Ratio</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setTradingPreferences((prev) => ({
                          ...prev,
                          riskRewardRatio: level.toLowerCase(),
                        }))
                      }
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        tradingPreferences.riskRewardRatio ===
                        level.toLowerCase()
                          ? "bg-gradient-to-r from-pink-500 to-purple-600"
                          : "bg-slate-700/50 hover:bg-slate-700"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trading Style Preferences */}
              {[
                {
                  icon: <TrendingUp />,
                  label: "Trading Style",
                  options: ["Swing", "Day", "Scalp"],
                  state: "swingDayScalp",
                },
                {
                  icon: <BarChart2 />,
                  label: "Asset Type",
                  options: ["Spot", "Futures", "Options"],
                  state: "spotFuturesOptions",
                },
                {
                  icon: <PieChart />,
                  label: "Exchange Type",
                  options: ["DEX", "CEX"],
                  state: "dexCexExchange",
                },
                {
                  icon: <Scale />,
                  label: "Position Type",
                  options: ["Short", "Long", "Both"],
                  state: "shortLong",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50"
                >
                  <div className="flex gap-2 mb-2">
                    <div className="text-pink-500 w-4 h-4">{item.icon}</div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {item.options.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setTradingPreferences((prev) => ({
                            ...prev,
                            [item.state]: option.toLowerCase(),
                          }))
                        }
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          tradingPreferences[item.state] ===
                          option.toLowerCase()
                            ? "bg-gradient-to-r from-pink-500 to-purple-600"
                            : "bg-slate-700/50 hover:bg-slate-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-100 text-end mt-4" onClick={handleUpdateProfile}>
              <button className="min-w-[120px] cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                Submit
              </button>
            </div>
          </div>

          {/* My Details */}
          <div className="space-y-4">
            <h2 className="font-semibold">My details</h2>
            <div className="space-y-2">
              {[
                {
                  icon: <AtSign className="w-5 h-5" />,
                  label: "Display name",
                  value: userData?.name || "Unknown",
                },
                {
                  icon: <MessageCircle className="w-5 h-5" />,
                  label: "Telegram username",
                  value: userData?.telegramUsername || "",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400">{item.icon}</div>
                    <div>
                      <div className="text-sm text-slate-400">{item.label}</div>
                      <div className="font-medium">{item.value}</div>
                    </div>
                  </div>
                  {/* <ChevronRight className="w-5 h-5 text-slate-400" /> */}
                </div>
              ))}
            </div>
          </div>

          {/* Trading Preferences */}
          {/* <div className="space-y-4">
            <h2 className="font-semibold">Trading Preferences</h2>
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">Risk/Reward Ratio</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setTradingPreferences((prev) => ({
                          ...prev,
                          riskRewardRatio: level.toLowerCase(),
                        }))
                      }
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        tradingPreferences.riskRewardRatio ===
                        level.toLowerCase()
                          ? "bg-gradient-to-r from-pink-500 to-purple-600"
                          : "bg-slate-700/50 hover:bg-slate-700"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {[
                {
                  icon: <TrendingUp />,
                  label: "Trading Style",
                  options: ["Swing", "Day", "Scalp"],
                  state: "swingDayScalp",
                },
                {
                  icon: <BarChart2 />,
                  label: "Asset Type",
                  options: ["Spot", "Futures", "Options"],
                  state: "spotFuturesOptions",
                },
                {
                  icon: <PieChart />,
                  label: "Exchange Type",
                  options: ["DEX", "CEX"],
                  state: "dexCexExchange",
                },
                {
                  icon: <Scale />,
                  label: "Position Type",
                  options: ["Short", "Long", "Both"],
                  state: "shortLong",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-pink-500 w-4 h-4">{item.icon}</div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {item.options.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setTradingPreferences((prev) => ({
                            ...prev,
                            [item.state]: option.toLowerCase(),
                          }))
                        }
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          tradingPreferences[item.state] ===
                          option.toLowerCase()
                            ? "bg-gradient-to-r from-pink-500 to-purple-600"
                            : "bg-slate-700/50 hover:bg-slate-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Communication */}
          <div className="space-y-4">
            <h2 className="font-semibold">Communication</h2>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <span>Language</span>
                </div>
                <select
                  value={communication.language}
                  onChange={(e) =>
                    setCommunication((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="bg-transparent text-right"
                >
                  <option value="English">English</option>
                  <option value="Hebrew">Hebrew</option>
                </select>
              </div>
            </div>
          </div>

          {/* Linked Accounts */}
          <div className="space-y-4">
            <h2 className="font-semibold">Linked Accounts</h2>
            <div className="space-y-2">
              {[
                { icon: <Instagram />, name: "Instagram" },
                { icon: <Facebook />, name: "Facebook" },
                { icon: <MessageCircle />, name: "Telegram" },
                { icon: <Twitter />, name: "Twitter" },
              ].map((platform, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400">{platform.icon}</div>
                    <span>{platform.name}</span>
                  </div>
                  <button className="text-pink-500 text-sm font-medium">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <NavigationBar onQuickAction={() => navigate("/create-signal")} />
      </div>
    </Spin>
  );
};

export default SettingsPage;
