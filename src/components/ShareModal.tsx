import React, { useState } from "react";
import { X, Twitter, Facebook, Send, Link2, Copy, Mail } from "lucide-react";
import html2canvas from "html2canvas";
import { getDecodedUserToken } from "../utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartRef?: React.RefObject<HTMLDivElement>;
  signalDetails?: {
    pair?: string;
    type?: string;
    entry?: string;
    takeProfit?: string;
    stopLoss?: string;
    consensus?: string;
    id?: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  chartRef,
  signalDetails,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const user = getDecodedUserToken();
  const referralCode = user?.username;
  // Generate chart image when modal opens
  React.useEffect(() => {
    if (isOpen && chartRef?.current) {
      html2canvas(chartRef.current).then((canvas) => {
        setChartImage(canvas.toDataURL("image/png"));
      });
    }
  }, [isOpen, chartRef]);

  if (!isOpen) return null;
  const text = `Check out this trading signal on Traderate!\n\n${signalDetails?.pair} ${signalDetails?.type}\nEntry: ${signalDetails?.entry}\nTP: ${signalDetails?.takeProfit}\nSL: ${signalDetails?.stopLoss}\nCommunity Consensus: ${signalDetails?.consensus}\n\nUse my referral to get started!`;
  const textWhatsapp = `https://t.me/share/url?url=https://t.me/${
    import.meta.env.VITE_TELEGRAM_BOT
  }?start=ref=${user?.username}_signal=${
    signalDetails?.id
  }\nCheck out this trading signal on Traderate!\n\n${signalDetails?.pair} ${
    signalDetails?.type
  }\nEntry: ${signalDetails?.entry}\nTP: ${signalDetails?.takeProfit}\nSL: ${
    signalDetails?.stopLoss
  }\nCommunity Consensus: ${
    signalDetails?.consensus
  }\n\nUse my referral to get started!`;

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      color: "bg-green-500",
      action: async () => {
        if (chartImage) {
          // Create a blob from the image data
          const blob = await (await fetch(chartImage)).blob();

          // Share via Web Share API if available
          if (navigator.share) {
            try {
              await navigator.share({
                text,
                files: [
                  new File([blob], "signal-chart.png", { type: "image/png" }),
                ],
              });
            } catch (err) {
              // Fallback to WhatsApp URL
              window.open(
                `https://wa.me/?text=${encodeURIComponent(textWhatsapp)}`,
                "_blank"
              );
            }
          } else {
            window.open(
              `https://wa.me/?text=${encodeURIComponent(textWhatsapp)}`,
              "_blank"
            );
          }
        } else {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(textWhatsapp)}`,
            "_blank"
          );
        }
      },
    },
    {
      name: "Telegram",
      icon: Send,
      color: "bg-blue-400",
      action: async () => {
        if (chartImage) {
          // Create a blob from the image data
          const blob = await (await fetch(chartImage)).blob();

          // Share via Web Share API if available
          if (navigator.share) {
            try {
              await navigator.share({
                text,
                files: [
                  new File([blob], "signal-chart.png", { type: "image/png" }),
                ],
              });
            } catch (err) {
              // Fallback to Telegram URL
              window.open(
                `https://t.me/share/url?url=https://t.me/${
                  import.meta.env.VITE_TELEGRAM_BOT
                }?start=ref=${user?.username}_signal=${
                  signalDetails?.id
                }&text=${encodeURIComponent(text)}`,
                "_blank"
              );
            }
          } else {
            window.open(
              `https://t.me/share/url?url=https://t.me/${
                import.meta.env.VITE_TELEGRAM_BOT
              }?start=ref=${user?.username}_signal=${
                signalDetails?.id
              }&text=${encodeURIComponent(text)}`,
              "_blank"
            );
          }
        } else {
          window.open(
            `https://t.me/share/url?url=https://t.me/${
              import.meta.env.VITE_TELEGRAM_BOT
            }?start=ref=${user?.username}_signal=${
              signalDetails?.id
            }&text=${encodeURIComponent(text)}`,
            "_blank"
          );
        }
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-blue-500",
      action: async () => {
        if (chartImage) {
          // Create a blob from the image data
          const blob = await (await fetch(chartImage)).blob();

          // Share via Web Share API if available
          if (navigator.share) {
            try {
              await navigator.share({
                text,
                files: [
                  new File([blob], "signal-chart.png", { type: "image/png" }),
                ],
              });
            } catch (err) {
              // Fallback to Twitter URL
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  text
                )}&url=https://t.me/share/url?url=https://t.me/${
                  import.meta.env.VITE_TELEGRAM_BOT
                }?start=ref=${user?.username}_signal=${signalDetails?.id}`,
                "_blank"
              );
            }
          } else {
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                text
              )}&url=https://t.me/share/url?url=https://t.me/${
                import.meta.env.VITE_TELEGRAM_BOT
              }?start=ref=${user?.username}_signal=${signalDetails?.id}`,
              "_blank"
            );
          }
        } else {
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              text
            )}&url=https://t.me/share/url?url=https://t.me/${
              import.meta.env.VITE_TELEGRAM_BOT
            }?start=ref=${user?.username}_signal=${signalDetails?.id}`,
            "_blank"
          );
        }
      },
    },
    // {
    //   name: "Facebook",
    //   icon: Facebook,
    //   color: "bg-blue-600",
    //   action: async () => {
    //     if (chartImage) {
    //       // Create a blob from the image data
    //       const blob = await (await fetch(chartImage)).blob();

    //       // Share via Web Share API if available
    //       if (navigator.share) {
    //         try {
    //           await navigator.share({
    //             url: window.location.href,
    //             files: [
    //               new File([blob], "signal-chart.png", { type: "image/png" }),
    //             ],
    //           });
    //         } catch (err) {
    //           // Fallback to Facebook URL
    //           window.open(
    //             `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    //               window.location.href
    //             )}`,
    //             "_blank"
    //           );
    //         }
    //       } else {
    //         window.open(
    //           `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    //             window.location.href
    //           )}`,
    //           "_blank"
    //         );
    //       }
    //     } else {
    //       window.open(
    //         `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    //           window.location.href
    //         )}`,
    //         "_blank"
    //       );
    //     }
    //   },
    // },
    // {
    //   name: "Email",
    //   icon: Mail,
    //   color: "bg-purple-500",
    //   action: async () => {
    //     const subject = "Check out this trading signal on Traderate!";
    //     const body = `${signalDetails?.pair} ${signalDetails?.type}\nEntry: ${signalDetails?.entry}\nTP: ${signalDetails?.takeProfit}\nSL: ${signalDetails?.stopLoss}\nCommunity Consensus: ${signalDetails?.consensus}\n\nUse my referral : ${
    //               import.meta.env.VITE_TELEGRAM_BOT
    //             }?start=ref=${user?.username}_signal=${signalDetails?.id} to get started!`;

    //     if (chartImage) {
    //       // Create a blob from the image data
    //       const blob = await (await fetch(chartImage)).blob();

    //       // Share via Web Share API if available
    //       if (navigator.share) {
    //         try {
    //           await navigator.share({
    //             text: body,
    //             files: [
    //               new File([blob], "signal-chart.png", { type: "image/png" }),
    //             ],
    //           });
    //         } catch (err) {
    //           // Fallback to mailto URL
    //           window.location.href = `mailto:?subject=${encodeURIComponent(
    //             subject
    //           )}&body=${encodeURIComponent(body)}`;
    //         }
    //       } else {
    //         window.location.href = `mailto:?subject=${encodeURIComponent(
    //           subject
    //         )}&body=${encodeURIComponent(body)}`;
    //       }
    //     } else {
    //       window.location.href = `mailto:?subject=${encodeURIComponent(
    //         subject
    //       )}&body=${encodeURIComponent(text)}`;
    //     }
    //   },
    // },
    {
      name: "Copy Link",
      icon: Copy,
      color: "bg-slate-600",
      action: async () => {
        const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${referralCode}`;

        if (chartImage) {
          try {
            // Try to copy both the URL and the image to clipboard
            await navigator.clipboard.write([
              new ClipboardItem({
                "text/plain": new Blob([referralUrl], { type: "text/plain" }),
                "image/png": await (await fetch(chartImage)).blob(),
              }),
            ]);
          } catch (err) {
            // Fallback to just copying the URL
            await navigator.clipboard.writeText(referralUrl);
          }
        } else {
          await navigator.clipboard.writeText(referralUrl);
        }
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
    },
  ];

  const handleShare = async (option: (typeof shareOptions)[0]) => {
    setIsSharing(true);
    try {
      await option.action();
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl w-full max-w-sm relative animate-in fade-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Share Signal</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border-b border-slate-700">
          {chartImage && (
            <div className="mb-3">
              <img
                src={chartImage}
                alt="Signal Chart"
                className="w-full rounded-lg border border-slate-700"
              />
            </div>
          )}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <h4 className="font-medium mb-1">{signalDetails?.pair} Signal</h4>
            <p className="text-sm text-slate-400">
              {`${signalDetails?.type} • Entry: ${signalDetails?.entry}`}
            </p>
            <p className="text-sm text-slate-400">
              Community Consensus: {signalDetails?.consensus}
            </p>
            <div className="mt-2 text-xs px-2 py-1 rounded-full bg-pink-500/10 text-pink-400 inline-block">
              Referral Code: {referralCode}
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleShare(option)}
                disabled={isSharing}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center`}
                >
                  {React.createElement(option.icon, { className: "w-5 h-5 text-white" })}
                </div>
                <span className="text-xs">
                  {option.name === "Copy Link" && isCopied
                    ? "Copied!"
                    : option.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
