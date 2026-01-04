"use client";

/**
 * @see https://next-intl-docs.vercel.app/docs/environments/error-files
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 * @see https://next-intl-docs.vercel.app/docs/environments/server-client-components
 */
import Link from "next/link";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import { ImageMedium } from "./base/image";
import { Button } from "./base/button/Button";

const StyledButton = styled(Button)`
  border-radius: 9999px;
  padding: 12px 24px;
  margin: 0 auto;
  cursor: pointer;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  margin: auto;
  padding: 48px 24px 80px 24px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
  max-width: 500px;
  margin: 0 auto;
`;

const StyledDescribe = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

const StyledTitle = styled.h1`
  margin: 0;
  color: #121212;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 48px;
`;

const StyledParagraph = styled.p`
  margin: 0;
  color: #121212;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 24px;
`;

const StyledImageContainer = styled.div`
  width: 320px;
  height: 320px;

  @media only screen and (max-width: 600px) {
    width: 200px;
    height: 200px;
  }
`;
export default function NotFoundContent() {
  const t = useTranslations("common");

  return (
    <StyledContainer>
      <StyledImageContainer>
        <ImageMedium src="/images/404.png" priority alt={t("pageNotFound.title")} />
      </StyledImageContainer>
      <StyledContent>
        <StyledDescribe>
          <StyledTitle>{t("pageNotFound.title")}</StyledTitle>
          <StyledParagraph>{t("pageNotFound.content")}</StyledParagraph>
        </StyledDescribe>
        <Link href="/" title={t("pageNotFound.homePage")}>
          <StyledButton>{t("pageNotFound.homePage")}</StyledButton>
        </Link>
      </StyledContent>
    </StyledContainer>
  );
}
