import Image from "next/image";
import profile from "@/images/ic_profile.png";
import kebab from "@/images/ic_kebab.png";
import styles from "./ChatItem.module.css";
import { useState } from "react";
import { deleteComments } from "@/utils/chatApi";

export default function ChatItem({ comments }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const timeAgo = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const timeDiff = (now - createdAt) / 1000;

    const seconds = Math.floor(timeDiff);
    const minutes = Math.floor(timeDiff / 60);
    const hours = Math.floor(timeDiff / 3600);
    const days = Math.floor(timeDiff / (3600 * 24));

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return `${seconds}초 전`;
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteComments(id);
      if (res.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {!comments.length ? (
        <p>댓글이 없습니다.</p>
      ) : (
        comments.map((chatItem) => (
          <div key={chatItem.id} className={styles.container}>
            <div className={styles.menu}>
              <p className={styles.content}>{chatItem.content}</p>
              <Image
                src={kebab}
                alt="kebab"
                className={styles.kebab}
                onClick={() => toggleDropdown(chatItem.id)}
              />
            </div>
            {openDropdownId === chatItem.id && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownItem}>수정하기</div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => handleDelete(chatItem.id)}
                >
                  삭제하기
                </div>
              </div>
            )}
            <div className={styles.info}>
              <Image
                src={profile}
                alt="profile"
                className={styles.profileImg}
              />
              <div className={styles.infoText}>
                <p>총명한 판다</p>
                <p>{timeAgo(chatItem.createdAt)}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
