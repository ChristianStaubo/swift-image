import { SiteHeader } from "@/components/site-header";

interface FeaturesLayoutProps {
  children: React.ReactNode;
}

const FeaturesLayout = ({ children }: FeaturesLayoutProps) => {
  return (
    <div className=" h-full flex flex-col">
      <SiteHeader />
      {children}
    </div>
  );
};

export default FeaturesLayout;
