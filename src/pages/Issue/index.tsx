import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { api } from '../../lib/axios';
import { Loading } from '../../components/Loading';
import { Banner } from '../../components/Banner';

import { PostContainer, Content } from './styles';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface issueInfo {
  htmlUrl: string;
  title: string;
  userLogin: string;
  createdAt: string;
  comments: number;
}

export function Issue() {
  const { user, repository, issue } = useParams();

  const [issueInfo, setIssueInfo] = useState({} as issueInfo); 
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchIssue() {
      const { data } = await api.get(`/repos/${user}/${repository}/issues/${issue}`);      

      setIssueInfo({
        htmlUrl: data.html_url,
        title: data.title,
        userLogin: data.user.login,
        createdAt: data.created_at,
        comments: data.comments
      })
      setBody(data.body);
      setIsLoading(false);
    }

    fetchIssue();
  }, []);

  const customRenderers = {
    code(code: any) {
      const { className, children } = code;
      const language = className?.split("-")[1];
      return (
        <SyntaxHighlighter
          style={coldarkDark}
          language={language}
          children={children}
        />
      );
    },
  };

  return (
    <PostContainer>
      {
        isLoading 
        ?
          <Loading />
        :
          <>
            <Banner
              issue={issueInfo}
            />
            <Content>
              <ReactMarkdown
              components={customRenderers}
                linkTarget={'_blank'}
              >
                {body}
              </ReactMarkdown>
            </Content>
          </>
      }
    </PostContainer>
  );
}