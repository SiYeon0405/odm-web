import type { ChangeEvent } from "react";

type ProfileImageUploadProps = {
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileImageUpload({ file, onChange }: ProfileImageUploadProps) {
  return (
    <label className="auth-field auth-upload" htmlFor="profile-image">
      <span>프로필 이미지</span>
      <span className="auth-upload-control">
        <span className="auth-upload-button">파일 선택</span>
        <span className="auth-upload-name">{file?.name ?? "선택된 이미지 없음"}</span>
      </span>
      <input id="profile-image" type="file" accept="image/*" onChange={onChange} />
    </label>
  );
}
