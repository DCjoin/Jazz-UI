��' u s e   s t r i c t ' ;  
  
  
 l e t   I 1 8 N   =   { } ;  
 I 1 8 N . g e t R e s o u r c e S t r i n g   =   f u n c t i o n ( r e s N a m e )   {  
     r e s N a m e   =   r e s N a m e . r e p l a c e ( / # / i g ,   ' ' ) ;  
     v a r   r e s o u r c e   =   I 1 8 N ;  
     v a r   n s A r r a y   =   r e s N a m e . s p l i t ( ' . ' ) ;  
     f o r   ( v a r   i   =   0 ;   i   <   n s A r r a y . l e n g t h ;   i + + )   {  
         r e s o u r c e   =   r e s o u r c e [ n s A r r a y [ i ] ] ;  
         i f   ( r e s o u r c e   = = =   u n d e f i n e d )   r e t u r n   u n d e f i n e d ;  
     }  
     a r g u m e n t s [ 0 ]   =   r e s o u r c e ;  
     r e t u r n   I 1 8 N . f o r m a t . a p p l y ( t h i s ,   a r g u m e n t s ) ;  
 } ;  
 I 1 8 N . f o r m a t   =   f u n c t i o n ( r e s )   {  
     v a r   r e g e x p ,  
         m a t c h e s ,  
         s   =   r e s ,  
         i ;  
  
     i   =   1 ;  
     f o r   ( ;   i   <   a r g u m e n t s . l e n g t h ;   i + + )   {  
         s   =   s . r e p l a c e ( n e w   R e g E x p ( ' \ \ { '   +   ( i   -   1 )   +   ' \ \ } ' ) ,   a r g u m e n t s [ i ] ) ;  
     }  
  
     r e g e x p   =   / # # ( \ w | \ . ) + # # / i g ;  
     m a t c h e s   =   s . m a t c h ( r e g e x p ) ;  
     i   =   0 ;  
     i f   ( m a t c h e s   ! = =   n u l l )   {  
         f o r   ( ;   i   <   m a t c h e s . l e n g t h ;   i + + )   {  
             s   =   s . r e p l a c e ( m a t c h e s [ i ] ,   I 1 8 N . g e t R e s o u r c e S t r i n g ( m a t c h e s [ i ] ) ) ;  
         }  
     }  
  
     r e t u r n   s . r e p l a c e ( / \ { \ d + \ } / i g ,   ' ' ) ;  
 } ;  
  
 I 1 8 N . M a i n M e n u   =   { } ;  
 I 1 8 N . M a i n M e n u . A s s e t   =   ' M y   a s s e t s ' ;  
 I 1 8 N . M a i n M e n u . A l a r m   =   ' F a i l u r e   a l a r m ' ;  
 I 1 8 N . M a i n M e n u . M a i n t a i n   =   ' E q u i p m e n t   m a i n t e n a n c e   ' ;  
 I 1 8 N . M a i n M e n u . S e t t i n g   =   ' S e t t i n g ' ;  
 I 1 8 N . M a i n M e n u . C u s t o m e r   =   ' C u s t o m e r   m a n a g e m e n t ' ;  
 I 1 8 N . M a i n M e n u . U s e r   =   ' U s e r   m a n a g e m e n t ' ;  
 I 1 8 N . M a i n M e n u . D e v i c e T e m p l a t e   =   ' L e d g e r   t e m p l a t e   ' ;  
 I 1 8 N . M a i n M e n u . P a r a m e t e r T e m p l a t e   =   ' P a r a m e t e r   t e m p l a t e ' ;  
  
 I 1 8 N . M a i n M e n u . M a p   =   ' M a p ' ;  
 I 1 8 N . M a i n M e n u . A l a r m   =   ' A l a r m ' ;  
 I 1 8 N . M a i n M e n u . E n e r g y   =   ' E n e r g y ' ;  
 I 1 8 N . M a i n M e n u . r e p o r t   =   ' R e p o r t ' ;  
  
 I 1 8 N . L o g i n   =   { } ;  
 I 1 8 N . L o g i n . U s e r N a m e   =   ' U s e r   n a m e ' ;  
 I 1 8 N . L o g i n . P a s s w o r d   =   ' P a s s w o r d ' ;  
 I 1 8 N . L o g i n . L o g o u t   =   ' L o g   o u t ' ;  
 I 1 8 N . L o g i n . L o g i n   =   ' L o g i n ' ;  
  
 I 1 8 N . M 2 1 2 0 0 1   =   ' U s e r   d o e s   n o t   e x i s t ' ;  
 I 1 8 N . M 2 1 2 0 0 2   =   ' I n v a l i d   s e r v i c e   p r o v i d e r   ' ;  
 I 1 8 N . M 2 1 2 0 0 3   =   ' S e r v i c e   p r o v i d e r   d o e s   n o t   e x i s t ' ;  
 I 1 8 N . M 2 1 2 0 0 4   =   ' S e r v i c e   p r o v i d e r   i s   i n v a l i d ' ;  
 I 1 8 N . M 2 1 2 0 0 5   =   ' U s e r   i s   i n v a l i d ' ;  
 I 1 8 N . M 2 1 2 0 0 6   =   ' I n c o r r e c t   p a s s w o r d ' ;  
 I 1 8 N . M 2 1 2 0 0 7   =   ' I n c o r r e c t   s e r v i c e   p r o v i d e r   d o m a i n   n a m e ' ;  
  
 I 1 8 N . C o m m o n   =   { } ;  
 I 1 8 N . C o m m o n . G l o s s a r y   =   { } ;  
 I 1 8 N . C o m m o n . G l o s s a r y . H i e r a r c h y N o d e   =   ' H i e r a r c h y   n o d e ' ;  
  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e   =   { } ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h   =   { } ;  
 I 1 8 N . C o m m o n . G l o s s a r y . W e e k D a y   =   { } ;  
  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . J a n u a r y   =   ' J a n u a r y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . F e b r u a r y   =   ' F e b r u a r y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . M a r c h   =   ' M a r c h ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . A p r i l   =   ' A p r i l ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . M a y   =   ' M a y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . J u n e   =   ' J u n e ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . J u l y   =   ' J u l y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . A u g u s t   =   ' A u g u s t ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . S e p t e m b e r   =   ' S e p t e m b e r ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . O c t o b e r   =   ' O c t o b e r ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . N o v e m b e r   =   ' N o v e m b e r ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . M o n t h N a m e . D e c e m b e r   =   ' D e c e m b e r ' ;  
  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . J a n u a r y   =   ' J a n u a r y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . F e b r u a r y   =   ' F e b r u a r y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . M a r c h   =   ' M a r c h ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . A p r i l   =   ' A p r i l ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . M a y   =   ' M a y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . J u n e   =   ' J u n e ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . J u l y   =   ' J u l y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . A u g u s t   =   ' A u g u s t ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . S e p t e m b e r   =   ' S e p t e m b e r ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . O c t o b e r   =   ' O c t o b e r ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . N o v e m b e r   =   ' N o v e m b e r ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . S h o r t M o n t h . D e c e m b e r   =   ' D e c e m b e r ' ;  
  
 I 1 8 N . C o m m o n . G l o s s a r y . W e e k D a y . M o n d a y   =   ' M o n d a y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . W e e k D a y . T u e s d a y   =   ' T u e s d a y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . W e e k D a y . W e d n e s d a y   =   ' W e d n e s d a y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . W e e k D a y . T h u r s d a y   =   ' T h u r s d a y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . W e e k D a y . F r i d a y   =   ' F r i d a y ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . W e e k D a y . S a t u r d a y   =   ' S a t u r d a y s ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . W e e k D a y . S u n d a y   =   ' S u n d a y ' ;  
  
 I 1 8 N . C o m m o n . D a t e R a n g e   =   { } ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . L a s t 7 D a y   =   ' L a s t   7   D a y s ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . L a s t 3 0 D a y   =   ' L a s t   3 0   D a y s ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . L a s t 1 2 M o n t h   =   ' L a s t   1 2   m o n t h s ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . T o d a y   =   ' T o d a y ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . Y e s t e r d a y   =   ' Y e s t e r d a y ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . T h i s W e e k   =   ' T h i s   w e e k ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . L a s t W e e k   =   ' L a s t   w e e k ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . T h i s M o n t h   =   ' T h i s   m o n t h ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . L a s t M o n t h   =   ' L a s t   m o n t h ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . T h i s Y e a r   =   ' T h i s   y e a r ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . L a s t Y e a r   =   ' L a s t   y e a r ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . C u s t o m e r i z e   =   ' U s e r - d e f i n e d ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . C u s t o m e r i z e T i m e   =   ' U s e r - d e f i n e d ' ;  
 I 1 8 N . C o m m o n . D a t e R a n g e . R e l a t i v e d T i m e   =   ' R e l a t i v e   t i m e ' ;  
  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r   =   { } ;  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r . A s c e n d i n g   =   ' A s c e n d i n g ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r . D e s c e n d i n g   =   ' D e s c e n d i n g ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r . A l l   =   ' A l l ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r . R a n k 3   =   ' T o p   3 ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r . R a n k 5   =   ' T o p   5 ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r . R a n k 1 0   =   ' T o p   1 0 ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r . R a n k 2 0   =   ' T o p   2 0 ' ;  
 I 1 8 N . C o m m o n . G l o s s a r y . O r d e r . R a n k 5 0   =   ' T o p   5 0 ' ;  
  
 I 1 8 N . C o m m o n . B u t t o n   =   { } ;  
 I 1 8 N . C o m m o n . B u t t o n . C a l e n d a r   =   { } ;  
 I 1 8 N . C o m m o n . B u t t o n . C a l e n d a r . S h o w H C   =   ' H C   s e a s o n s ' ;  
 I 1 8 N . C o m m o n . B u t t o n . C a l e n d a r . S h o w H o l i d a y   =   ' N o n - w o r k   t i m e ' ;  
 I 1 8 N . C o m m o n . B u t t o n . S h o w   =   ' V i e w ' ;  
  
 I 1 8 N . C o m m o n . C a r b o n U o m T y p e   =   { } ;  
 I 1 8 N . C o m m o n . C a r b o n U o m T y p e . S t a n d a r d C o a l   =   ' S t a n d a r d   c o a l ' ;  
 I 1 8 N . C o m m o n . C a r b o n U o m T y p e . C O 2   =   ' C a r b o n   d i o x i d e ' ;  
 I 1 8 N . C o m m o n . C a r b o n U o m T y p e . T r e e   =   ' T r e e ' ;  
  
 I 1 8 N . D a t e T i m e F o r m a t   =   { } ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t   =   { } ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . M i l l i s e c o n d   =   ' % H o u r % M i n u t e % S e c n o d % L   M s ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . S e c o n d   =   ' % H % M % S ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . M i n u t e   =   ' % H % M ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . H o u r   =   ' % H ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . D a y   =   ' % m o n t h % d a y ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . D a y h o u r   =   ' % m % d % H ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . W e e k   =   ' % m o n t h % d a y ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . M o n t h   =   ' % m ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . F u l l m o n t h   =   ' % Y % m ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . Y e a r   =   ' % Y ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . F u l l D a t e T i m e   =   ' % Y % m % d   % H % M % S ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . F u l l D a t e   =   ' % Y % m % d ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . H i g h F o r m a t . F u l l Y e a r   =   ' F u l l   y e a r ' ;  
  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t   =   { } ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . S e c o n d   =   ' M M D D , Y Y Y Y ,   H H m m s s ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . F u l l M i n u t e   =   ' M M D D ,   Y Y Y Y ,   H H m m s s ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . R a n g e F u l l M i n u t e   =   ' M M D D ,   Y Y Y Y ,   H H m m s s ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . M i n u t e   =   ' H H m m ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . F u l l H o u r   =   ' M M D D , Y Y Y Y , H H ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . H o u r   =   ' H H ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . F u l l D a y   =   ' M M D D , Y Y Y Y ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . D a y   =   ' D D ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . W e e k   =   ' M M D D , Y Y Y Y ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . M o n t h   =   ' M M Y Y Y Y ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . M o n t h D a t e   =   ' D D M M ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . Y e a r   =   ' Y Y Y Y ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . F u l l D a t e T i m e   =   ' M M D D , Y Y Y Y ,   H H m m s s ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . F u l l D a t e   =   ' M M D D , Y Y Y Y ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . M o n t h D a y H o u r   =   ' m d H ' ;  
 I 1 8 N . D a t e T i m e F o r m a t . I n t e r v a l F o r m a t . D a y H o u r   =   ' d H ' ;  
  
 I 1 8 N . E M   =   { } ;  
 I 1 8 N . E M . T o   =   ' T o ' ;  
 I 1 8 N . E M . W e e k   =   ' W e e k ' ;  
 I 1 8 N . E M . R a w   =   ' M i n u t e ' ;  
 I 1 8 N . E M . H o u r   =   ' H o u r ' ;  
 I 1 8 N . E M . D a y   =   ' D a y ' ;  
 I 1 8 N . E M . M o n t h   =   ' M o n t h ' ;  
 I 1 8 N . E M . Y e a r   =   ' Y e a r ' ;  
 I 1 8 N . E M . C l o c k 2 4   =   ' 2 4 ' ;  
 I 1 8 N . E M . C l o c k 2 4 I n W i d g e t   =   ' 2 4 ' ;  
 I 1 8 N . E M . C l o c k 2 4 M i n u t e 0   =   ' 2 4 : 0 0 : 0 0 ' ;  
  
 I 1 8 N . E M . U s e R a w   =   ' B y   m i n u t e ' ;  
 I 1 8 N . E M . U s e W e e k   =   ' B y   w e e k ' ;  
 I 1 8 N . E M . U s e H o u r   =   ' B y   h o u r ' ;  
 I 1 8 N . E M . U s e D a y   =   ' B y   d a y ' ;  
 I 1 8 N . E M . U s e M o n t h   =   ' B y   m o n t h ' ;  
 I 1 8 N . E M . U s e Y e a r   =   ' B y   y e a r ' ;  
 I 1 8 N . E M . S t e p E r r o r   =   ' S e l e c t e d   t a g   d o e s   n o t   s u p p o r t   { 0 }   i n t e r v a l .   P l e a s e   c h a n g e   t o   a n o t h e r   i n t e r v a l   a n d   t r y . ' ;  
  
 I 1 8 N . E M . T o o l   =   { } ;  
 I 1 8 N . E M . T o o l . C l e a r C h a r t   =   ' C l e a r   c h a r t ' ;  
 I 1 8 N . E M . T o o l . A s s i s t C o m p a r e   =   ' A n a l y s i s   s u p p o r t i n g ' ;  
 I 1 8 N . E M . T o o l . W e a t h e r   =   { } ;  
 I 1 8 N . E M . T o o l . W e a t h e r . W e a t h e r I n f o   =   ' W e a t h e r ' ;  
 I 1 8 N . E M . T o o l . W e a t h e r . T e m p e r a t u r e   =   ' T e m p e r a t u r e ' ;  
 I 1 8 N . E M . T o o l . W e a t h e r . H u m i d i t y   =   ' H u m i d i t y ' ;  
 I 1 8 N . E M . T o o l . C a l e n d a r   =   { } ;  
 I 1 8 N . E M . T o o l . C a l e n d a r . B a c k g r o u n d C o l o r   =   ' S h o w   c a l e n d a r ' ;  
 I 1 8 N . E M . T o o l . C a l e n d a r . N o n e W o r k T i m e   =   ' N o n - w o r k   t i m e ' ;  
 I 1 8 N . E M . T o o l . C a l e n d a r . H o t C o l d S e a s o n   =   ' H C   s e a s o n s ' ;  
 I 1 8 N . E M . T o o l . B e n c h m a r k   =   ' I n d u s t r y   b e n c h m a r k ' ;  
 I 1 8 N . E M . T o o l . H i s t o r y C o m p a r e   =   ' H i s t o r y   c o m p a r i s o n ' ;  
 I 1 8 N . E M . T o o l . B e n c h m a r k S e t t i n g   =   ' B a s e l i n e   s e t t i n g ' ;  
 I 1 8 N . E M . T o o l . D a t a S u m   =   ' D a t a   S u m ' ;  
  
 I 1 8 N . E M . K p i M o d e E M   =   ' E n e r g y ' ;  
 I 1 8 N . E M . K p i M o d e C a r b o n   =   ' C a r b o n ' ;  
 I 1 8 N . E M . K p i M o d e C o s t   =   ' C o s t ' ;  
  
 I 1 8 N . E M . E r r o r N e e d V a l i d T i m e R a n g e   =   ' P l e a s e   c h o o s e   t h e   r i g h t   t i m e   r a n g e ' ;  
  
  
 I 1 8 N . E M . R a n k   =   { } ;  
 I 1 8 N . E M . R a n k . T o t a l R a n k   =   ' O v e r a l l   r a n k i n g ' ;  
 I 1 8 N . E M . R a n k . R a n k B y P e o p l e   =   ' P e r   c a p i t a ' ;  
 I 1 8 N . E M . R a n k . R a n k B y A r e a   =   ' U n i t   a r e a ' ;  
 I 1 8 N . E M . R a n k . R a n k B y H e a t A r e a   =   ' U n i t   h e a t i n g   a r e a ' ;  
 I 1 8 N . E M . R a n k . R a n k B y C o o l A r e a   =   ' U n i t   c o o l i n g   a r e a ' ;  
 I 1 8 N . E M . R a n k . R a n k B y R o o m   =   ' U n i t   g u e s t   r o o m ' ;  
 I 1 8 N . E M . R a n k . R a n k B y U s e d R o o m   =   ' U n i t   g u e s t   r o o m   o c c u p i e d ' ;  
 I 1 8 N . E M . R a n k . R a n k B y B e d   =   ' U n i t   b e d ' ;  
 I 1 8 N . E M . R a n k . R a n k B y U s e d B e d   =   ' U n i t   b e d   o c c u p i e d ' ;  
 I 1 8 N . E M . R a n k . H i e r T i t l e   =   ' P l e a s e   s e l e c t   t h e   h i e r a r c h y   n o d e s   f o r   r a n k i n g ' ;  
 I 1 8 N . E M . R a n k . R a n k N a m e   =   ' R a n k i n g ' ;  
 I 1 8 N . E M . R a n k . R a n k T o o l t i p   =   ' R a n k i n g : { 0 } / { 1 } ' ;  
  
 I 1 8 N . E M . U n i t   =   { } ;  
 I 1 8 N . E M . U n i t . U n i t O r i g i n a l   =   ' O r i g i n a l   i n d i c a t o r   v a l u e ' ;  
 I 1 8 N . E M . U n i t . U n i t P o p u l a t i o n A l i a s   =   ' P e r   c a p i t a ' ;  
 I 1 8 N . E M . U n i t . U n i t P o p u l a t i o n   =   ' U n i t   p o p u l a t i o n ' ;  
 I 1 8 N . E M . U n i t . U n i t A r e a   =   ' U n i t   a r e a ' ;  
 I 1 8 N . E M . U n i t . U n i t C o l d A r e a   =   ' U n i t   c o o l i n g   a r e a ' ;  
 I 1 8 N . E M . U n i t . U n i t W a r m A r e a   =   ' U n i t   h e a t i n g   a r e a ' ;  
 I 1 8 N . E M . U n i t . U n i t R o o m   =   ' U n i t   g u e s t   r o o m ' ;  
 I 1 8 N . E M . U n i t . U n i t U s e d R o o m   =   ' U n i t   g u e s t   r o o m   o c c u p i e d ' ;  
 I 1 8 N . E M . U n i t . U n i t B e d   =   ' U n i t   b e d ' ;  
 I 1 8 N . E M . U n i t . U n i t U s e d B e d   =   ' U n i t   b e d   o c c u p i e d ' ;  
  
 I 1 8 N . E M . D a y N i g h t R a t i o   =   ' D a y - n i g h t   r a t i o ' ;  
 I 1 8 N . E M . W o r k H o l i d a y R a t i o   =   ' D a y - o f f   r a t i o ' ;  
  
 I 1 8 N . E M . R a t i o   =   { } ;  
 I 1 8 N . E M . R a t i o . C a c u l a t e V a l u e   =   ' C a l c u l a t e d   v a l u e ' ;  
 I 1 8 N . E M . R a t i o . R a w V a l u e   =   ' O r i g i n a l   v a l u e ' ;  
 I 1 8 N . E M . R a t i o . T a r g e t V a l u e   =   ' T a r g e t ' ;  
 I 1 8 N . E M . R a t i o . B a s e V a l u e   =   ' B a s e l i n e ' ;  
  
  
  
 I 1 8 N . E M . T o t a l   =   ' O v e r v i e w ' ;  
 I 1 8 N . E M . P l a i n   =   ' N o r m a l   p e r i o d ' ;  
 I 1 8 N . E M . V a l l e y   =   ' V a l l e y   p e r i o d ' ;  
 I 1 8 N . E M . P e a k   =   ' P e a k   p e r i o d ' ;  
 I 1 8 N . E M . B y P e a k V a l l e y   =   ' P e a k / V a l l e y   d i s p l a y ' ;  
  
 I 1 8 N . E M . E n e r g y A n a l y s e   =   { } ;  
 I 1 8 N . E M . E n e r g y A n a l y s e . A d d I n t e r v a l W i n d o w   =   { } ;  
 I 1 8 N . E M . E n e r g y A n a l y s e . A d d I n t e r v a l W i n d o w . T i t l e   =   ' H i s t o r i c a l   d a t a   c o m p a r i s o n ' ;  
 I 1 8 N . E M . E n e r g y A n a l y s e . A d d I n t e r v a l W i n d o w . C o m p a r e T i m e P r e v i o u s C o m b o L a b e l   =   ' L a s t ' ;  
 I 1 8 N . E M . E n e r g y A n a l y s e . A d d I n t e r v a l W i n d o w . C o m p a r e T i m e P r e v i o u s 7 D a y   =   ' 7   d a y s ' ;  
 I 1 8 N . E M . E n e r g y A n a l y s e . A d d I n t e r v a l W i n d o w . C o m p a r e T i m e P r e v i o u s 3 0 D a y   =   ' 3 0   d a y s ' ;  
 I 1 8 N . E M . E n e r g y A n a l y s e . A d d I n t e r v a l W i n d o w . C o m p a r e T i m e P r e v i o u s 1 2 M o n t h   =   ' 3 0   m o n t h s ' ;  
  
 I 1 8 N . E M . C a n n o t S h o w C a l e n d a r B y S t e p   =   ' T h e   c u r r e n t   i n t e r v a l   d o e s   n o t   s u p p o r t   d i s p l a y   o f   { 0 }   b a c k g r o u n d   c o l o r . ' ;  
 I 1 8 N . E M . C a n n o t S h o w C a l e n d a r B y T i m e R a n g e   =   ' N o   c a l e n d a r   b a c k g r o u n d   i s   s e e n ?   C h a n g e   t o   a n o t h e r   t i m e   a n d   t r y . ' ;  
 I 1 8 N . E M . W e a t h e r S u p p o r t s O n l y S i n g l e H i e r a r c h y   =   ' T h i s   f u n c t i o n   o n l y   s u p p o r t s   s i n g l e - b u i l d i n g   t a g s . ' ;  
 I 1 8 N . E M . W e a t h e r S u p p o r t s O n l y H o u r l y S t e p   =   ' T h i s   f u n c t i o n   o n l y   s u p p o r t s   h o u r l y   i n t e r v a l . ' ;  
  
 I 1 8 N . E M . C h a r T y p e   =   { } ;  
 I 1 8 N . E M . C h a r T y p e . L i n e   =   ' L i n e ' ;  
 I 1 8 N . E M . C h a r T y p e . B a r   =   ' C o l u m n ' ;  
 I 1 8 N . E M . C h a r T y p e . S t a c k   =   ' S t a c k ' ;  
 I 1 8 N . E M . C h a r T y p e . P i e   =   ' P i e ' ;  
 I 1 8 N . E M . C h a r T y p e . R a w D a t a   =   ' R a w   d a t a ' ;  
  
 I 1 8 N . E M . L e g e n d   =   { } ;  
 I 1 8 N . E M . L e g e n d . T o L i n e   =   ' S w i t c h   t o   l i n e ' ;  
 I 1 8 N . E M . L e g e n d . T o C o l u m n   =   ' S w i t c h   t o   c o l u m n ' ;  
 I 1 8 N . E M . L e g e n d . T o S t a c k i n g   =   ' S w i t c h   t o   s t a c k ' ;  
  
 / / w o r k d a y  
 I 1 8 N . S e t t i n g   =   { } ;  
 I 1 8 N . S e t t i n g . C a l e n d a r   =   { } ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . W o r k D a y   =   ' W o r k d a y ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . H o l i d a y   =   ' N o n - w o r k d a y ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . D e f a u l t W o r k D a y   =   ' D e f a u l t   w o r k d a y :   M o n .   - F r i . ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . A d d i t i o n a l D a y   =   ' S u p p l e m e n t a r y   d a t e ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . I t e m T y p e   =   ' D a t e   t y p e ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . S t a r t D a t e   =   ' S t a r t   d a t e ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . E n d D a t e   =   ' E n d   d a t e ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . M o n t h   =   ' M o n t h ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . S t a r t M o n t h   =   ' S t a r t   m o n t h ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . E n d M o n t h   =   ' E n d   m o n t h ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . D a t e   =   ' D a y ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . S e a n s o n T y p e   =   ' S e a s o n   t y p e ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . M o n t h D a y F r o m T o   =   ' { 0 } M o n t h { 1 } d a y   t o   { 2 } m o n t h { 3 } d a y ' ;  
  
 I 1 8 N . S e t t i n g . C a l e n d a r . W a r m S e a s o n   =   ' H e a t i n g   s e a s o n ' ;  
 I 1 8 N . S e t t i n g . C a l e n d a r . C o l d S e a s o n   =   ' C o o l i n g   s e a s o n ' ;  
  
 I 1 8 N . S e t t i n g . B e n c h m a r k   =   { } ;  
 I 1 8 N . S e t t i n g . B e n c h m a r k . L a b e l   =   { } ;  
 I 1 8 N . S e t t i n g . B e n c h m a r k . L a b e l . N o n e   =   ' N o n e ' ;  
 I 1 8 N . S e t t i n g . B e n c h m a r k . L a b e l . S e l e c t L a b e l l i n g   =   ' P l e a s e   s e l e c t   a   l a b e l i n g ' ;  
  
 I 1 8 N . S e t t i n g . L a b e l i n g   =   { } ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l   =   { } ;  
  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . I n d u s t r y   =   ' I n d u s t r y ' ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . C l i m a t e Z o n e   =   ' C l i m a t e   z o n e ' ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . C u s t o m i z e d L a b e l i n g   =   ' C u s t o m i z e d   l a b e l i n g ' ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . L a b e l i n g   =   ' L a b e l i n g ' ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . L a b e l i n g S e t t i n g   =   ' L a b e l i n g ' ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . I n d u s t r y L a b e l i n g   =   ' I n d u s t r y   l a b e l i n g ' ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . I n d u s t r y L a b e l i n g S e t t i n g   =   ' I n d u s t r y   l a b e l i n g ' ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . L a b e l i n g G r a d e   =   ' L a b e l i n g   l e v e l ' ;  
 I 1 8 N . S e t t i n g . L a b e l i n g . L a b e l . D a t a Y e a r   =   ' D a t a   s o u r c e ' ;  
  
 I 1 8 N . S e t t i n g . T a r g e t B a s e l i n e   =   { } ;  
 I 1 8 N . S e t t i n g . T a r g e t B a s e l i n e . A l a r m T h r e s h o l d   =   ' A l a r m   s e n s i t i v i t y ' ;  
 I 1 8 N . S e t t i n g . T a r g e t B a s e l i n e . A l a r m T h r e s h o l d T i p   =   ' W h e n   t h e   d a t a   g o e s   b e y o n d   t h e   s e n s i t i v i t y   s e t   b y   t h e   r e f e r e n c e   v a l u e ,   t h e   a l a r m   i s   d i s p l a y e d .   ' ;  
  
 I 1 8 N . S e t t i n g . U s e r   =   { } ;  
 I 1 8 N . S e t t i n g . U s e r . E n e r g y C o n s u l t a n t   =   ' E n e r g y   C o n s u l t a n t ' ;  
 I 1 8 N . S e t t i n g . U s e r . T e c h n i c i s t   =   ' T e c h n i c i s t ' ;  
 I 1 8 N . S e t t i n g . U s e r . C u s t o m e r M a n a g e r   =   ' C u s t o m e r   M a n a g e r ' ;  
 I 1 8 N . S e t t i n g . U s e r . P l a t f o r m M a n a g e r   =   ' P l a t f o r m   M a n a g e r ' ;  
 I 1 8 N . S e t t i n g . U s e r . E n e r g y M a n a g e r   =   ' E n e r g y   M a n a g e r ' ;  
 I 1 8 N . S e t t i n g . U s e r . E n e r g y E n g i n e e r   =   ' E n e r g y   E n g i n e e r ' ;  
 I 1 8 N . S e t t i n g . U s e r . D e p t M a n a g e r   =   ' D e p a r t m e n t   M a n a g e r ' ;  
 I 1 8 N . S e t t i n g . U s e r . M a n a g e r   =   ' M a n a g e r s ' ;  
 I 1 8 N . S e t t i n g . U s e r . B u s i n e s s P e r s o n   =   ' B u s i n e s s   P e r s o n ' ;  
 I 1 8 N . S e t t i n g . U s e r . S a l e s   =   ' S a l e s ' ;  
 I 1 8 N . S e t t i n g . U s e r . S e r v e r M a n a g e r   =   ' S P   M a n a g e r ' ;  
  
 I 1 8 N . C o m m o n . L a b e l   =   { } ;  
 I 1 8 N . C o m m o n . L a b e l . U n k n o w n E r r o r   =   ' S o r r y ,   u n k n o w n   e r r o r . ' ;  
  
 I 1 8 N . M e s s a g e   =   { } ;  
  
 I 1 8 N . M e s s a g e . D e l e t i o n C o n c u r r e n c y   =   ' { 0 }   d o e s   n o t   e x i s t .   W e   w i l l   r e f r e s h   i t   i m m e d i a t e l y . ' ;  
 I 1 8 N . M e s s a g e . U p d a t e C o n c u r r e n c y   =   ' { 0 }   h a s   b e e n   m o d i f i e d .   W e   w i l l   r e f r e s h   i t   i m m e d i a t e l y . ' ;  
 I 1 8 N . M e s s a g e . C u s t o m e r U n a v a i l a b l e   =   ' S o r r y .   T h i s   c u s t o m e r   d o e s   n o t   e x i s t   o r   h a s   n o   a c c e s s   a u t h o r i t y .   P l e a s e   l o g   o u t   a n d   l o g   i n   a g a i n . ' ;  
  
 I 1 8 N . M e s s a g e . M 1   =   ' S e r v e r   e r r o r . ' ;  
 I 1 8 N . M e s s a g e . M 8   =   ' Y o u   d o   n o t   h a v e   t h i s   f u n c t i o n   a u t h o r i t y . ' ;  
 I 1 8 N . M e s s a g e . M 9   =   ' Y o u   d o   n o t   h a v e   t h i s   d a t a   a u t h o r i t y . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 1 0 0 2   =   ' H i e r a r c h y   I D   i s   i l l e g a l .   Y o u   c a n n o t   a c c e s s   t h e   a d v a n c e d   a t t r i b u t e s . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 0 6   =   ' T h e   c o d e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 1 0   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 1 1   =   ' T h e   p a r e n t   n o d e   o f   t h i s   h i e r a r c h y   t r e e   h a s   b e e n   d e l e t e d   a n d   t h i s   n o d e   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 1 2   =   ' T h i s   h i e r a r c h y   n o d e   i n c l u d e s   c h i l d   n o d e s   a n d   t h u s   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 1 3   =   ' T h e   h i e r a r c h y   l e v e l   e x c e e d s   t h e   l i m i t . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 1 4   =   ' " T h i s   n o d e   h a s   b e e n   m o d i f i e d   o r   d e l e t e d   b y   a n o t h e r   u s e r ,   t h e r e f o r e   t h e   h i e r a r c h y   t r e e   w i l l   b e   r e f r e s h e d . " ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 1 5   =   ' T h e   c u r r e n t   h i e r a r c h y   n o d e   h a s   n o   c h i l d   n o d e s . ' ;   / / f o r   e n e r g y   v i e w   s i n g l e   t a g   t o   p i e   c h a r t  
 I 1 8 N . M e s s a g e . M 0 1 0 1 6   =   ' R e l e v a n t   h i e r a r c h y   d o e s   n o t   h a v e   a   v a l i d   c a l e n d a r ,   t h u s   t h e   t a r g e t   l i n e   a n d   t h e   b a s e l i n e   f o r   t h i s   y e a r   c a n n o t   b e   o b t a i n e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 1 8   =   ' C a n n o t   m o v e   t o   t a r g e t   n o d e ,   p l e a s e   f o l l o w i n g   r u l e s   t o   m o v e   n o d e :   < b r / > O r g   - >   O r g ,   C u s t o m e r ;   < b r / > S i t e   - >   O r g ,   C u s t o m e r ;   < b r / > B u i l d i n g   - >   S i t e ,   O r g ,   C u s t o m e r . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 0 1 9   =   ' T h e   h i e r a r c h y   w a s   m o d i f i e d ' ;  
 I 1 8 N . M e s s a g e . M 0 1 2 5 1   =   ' A d v a n c e d   a t t r i b u t e s   o f   t h e   h i e r a r c h y   n o d e   h a v e   b e e n   m o d i f i e d   b y   o t h e r   u s e r s .   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 2 5 4   =   ' E n t r i e s   o f   a d v a n c e d   p r o p e r t i e s   a r e   i l l e g a l ,   a n d   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 3 0 1   =   ' C a l e n d a r   h a s   b e e n   m o d i f i e d   b y   o t h e r   u s e r s . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 3 0 2   =   ' C a l e n d a r   h a s   b e e n   c r e a t e d   f o r   t h i s   n o d e   a n d   r e c r e a t i o n   i s   n o t   a l l o w e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 3 0 4   =   ' T h i s   t a g   i s   n o t   a s s o c i a t e d   w i t h   a n y   h i e r a r c h y . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 3 0 5   =   ' T h e   h i e r a r c h y   a s s o c i a t e d   w i t h   t h e   t a g   h a s   n o   c a l e n d a r   f e a t u r e ,   a n d   c a n n o t   b e   c a l c u l a t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 3 0 6   =   ' T i m e   p e r i o d s   a r e   o v e r l a p p e d .   P l e a s e   c h e c k   i t . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 4 0 1   =   ' T h e   h i e r a r c h y   n o d e s   a l r e a d y   h a v e   s y s t e m   d i m e n s i o n   s e t t i n g s   t h a t   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 4 0 2   =   ' T h e   h i e r a r c h y   n o d e s   a l r e a d y   h a v e   r e g i o n a l   d i m e n s i o n   s e t t i n g s   t h a t   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 4 0 5   =   ' T h e   h i e r a r c h y   n o d e s   a l r e a d y   h a v e   c a l e n d a r   s e t t i n g s   t h a t   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 4 0 6   =   ' T h e   h i e r a r c h y   n o d e s   a l r e a d y   h a v e   c o s t   s e t t i n g s   t h a t   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 4 0 7   =   ' T h e   h i e r a r c h y   n o d e s   a l r e a d y   h a v e   a d v a n c e d   a t t r i b u t e   s e t t i n g s   t h a t   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 4 0 8   =   ' T h e   h i e r a r c h y   n o d e s   a l r e a d y   h a v e   t a g   a s s o c i a t i o n s   t h a t   c a n n o t   b e   d e l e t e d . ' ;  
  
 / / b u i l d i n g   p i c t u r e  
 I 1 8 N . M e s s a g e . M 0 1 5 0 3   =   ' O n l y   j p g   /   p n g   i m a g e s   c a n   b e   u p l o a d e d .   P l e a s e   u p l o a d   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 5 0 4   =   ' I m a g e   f i l e   i s   t o o   l a r g e .   P l e a s e   u p l o a d   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 5 0 5   =   ' I m a g e   s i z e   i s   t o o   s m a l l .   P l e a s e   u p l o a d   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 5 0 6   =   ' I m a g e   s i z e   i s   t o o   l a r g e .   P l e a s e   u p l o a d   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . P i c t u r e U p l o a d F a i l e d   =   ' I m a g e   u p l o a d   f a i l e d . P l e a s e   t r y   a g a i n   l a t e r . ' ;  
  
 / * * * * * *  
 E n e r g y   E r r o r   C o d e  
 * * * * * * * /  
 I 1 8 N . M e s s a g e . M 0 2 0 0 4   =   ' P o l y m e r   g r a n u l a r i t y   i l l e g a l ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 0 7   =   ' S t a r t   t i m e   c a n n o t   b e   e a r l i e r   t h a n   t h e   e n d   t i m e ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 0 8   =   ' P i e   c h a r t   c a n n o t   b e   d r a w n   d u e   t o   d i f f e r e n t   c o m m o d i t i e s . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 1 1   =   ' V i e w i n g   r a w   d a t a   i s   n o t   s u p p o r t e d   f o r   v i r t u a l   t a g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 1 3   =   ' T h i s   t a g   h a s   b e e n   d e l e t e d   a n d   c a n n o t   b e   l o a d e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 2 0   =   ' C h a r t   e x p o r t     f a i l e d .   P l e a s e   c l i c k   " V i e w   D a t a "   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 2 1   =   ' E X C E L   e x p o r t     f a i l e d .   P l e a s e   c l i c k   " V i e w   D a t a "   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 1 0 4   =   ' U n a b l e   t o   c o n v e r t   t h e   m e d i a   u n i t s   o f   n o n - e n e r g y   u s e   g r o u p       ' ;  
 I 1 8 N . M e s s a g e . M 0 2 1 0 5   =   ' S o r r y .   A n   e r r o r   o c c u r r e d   a n d   t h e   p i e   c h a r t   c a n n o t   b e   d r a w n .     ' ;  
 I 1 8 N . M e s s a g e . M 0 2 1 0 6   =   ' S o r r y .   A n   e r r o r   o c c u r r e d   a n d   t h e   p i e   c h a r t   c a n n o t   b e   d r a w n .     ' ;  
 I 1 8 N . M e s s a g e . M 0 2 1 0 7   =   ' S o r r y .   A n   e r r o r   o c c u r r e d   a n d   t h e   p i e   c h a r t   c a n n o t   b e   d r a w n .     ' ;  
 I 1 8 N . M e s s a g e . M 0 2 1 0 8   =   ' C a n n o t   b e   c o n v e r t e d   b e c a u s e   o f   d i f f e r e n t   p r o p e r t i e s   o f   c o m m o d i t i e s . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 1 0 9   =   ' C a n n o t   b e   c o n v e r t e d   i n t o   c o m m o n   u n i t   b e c a u s e   o f   d i f f e r e n t   c o m m o d i t i e s . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 1 1 4   =   ' T a g s   c a n n o t   b e   c o n v e r t e d   i n t o   a   u n i f o r m   u n i t . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 1 7   =   ' T a g   a s s o c i a t i o n   c h a n g e s   a n d   t h u s   d r a w i n g   c a n n o t   b e   c r e a t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 2 0 3   =   ' T h i s   t a g   d o e s   n o t   e x i s t .   C a n n o t   g e t   t a r g e t   a n d   b a s e l i n e   v a l u e . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 2 0 5   =   ' T h e   k e y   p e r f o r m a n c e   i n d i c a t o r   o f   d a y - n i g h t   r a t i o   c a n n o t   b e   d i s p l a y e d   b y   h o u r . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 3 0 1   =   ' T h i s   h i e r a r c h y   n o d e   d o e s   n o t   e x i s t . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 2 3   =   ' S e l e c t e d   t a g s   h a v e   d i f f e r e n t   c o m m o d i t i e s ,   s o   p i e   c h a r t s   c a n n o t   b e   d r a w n   j o i n t l y . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 0 9   =   ' N o   d a t a   a u t h o r i t y   o r   t h e   a u t h o r i t y   h a s   b e e n   m o d i f i e d .   D a t a   c a n n o t   b e   i n q u i r e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 4 0 7   =   ' E l e c t r i c i t y   p r i c e   i n   p e a k / v a l l e y / n o r m a l   p e r i o d   c a n n o t   b e   d i s p l a y e d   i n   m i n u t e   o r   h o u r   l e v e l . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 4 0 8   =   ' T h i s   n o d e   i s   n o t   c o n f i g u r e d   w i t h   p e a k / v a l l e y   p e r i o d   a n d   t h u s   c a n n o t   b e   d i s p l a y e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 0 2 7   =   ' C a n   n o t   v i e w   d a t a   b e c a u s e   t h e   s t e p   i n   r e c o r d   i s   s m a l l e r   t h a n   s u p p o r t e d   m i n i m u m   s t e p . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 2 6 0 1   =   ' T h e   d a y   a n d   n i g h t   c a l e n d a r   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;   / / ' { 0 } @b�[�^�vB\�~���p�l	g��n<fY�e�S��e�l�gw<fY�kpenc' ;  
 I 1 8 N . M e s s a g e . M 0 2 6 0 2   =   ' T h e   w o r k i n g   c a l e n d a r   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;   / / ' { 0 } @b�[�^�vB\�~���p�l	g��n�]\O�e�S��e�l�gwlQO�kpenc' ;  
 I 1 8 N . M e s s a g e . M 0 2 6 0 3   =   ' T h e   t o t a l   a r e a   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 6 0 4   =   ' T h e   c o o l i n g   a r e a   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 6 0 5   =   ' T h e   h e a t i n g   a r e a   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 6 0 6   =   ' T h e   p o p u l a t i o n   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 2 5 0 0   =   ' T h i s   t a g   i s   n o t   a s s o c i a t e d   w i t h   a n y   h i e r a r c h y . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 0 1   =   ' T h e   p o p u l a t i o n   a t t r i b u t e   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 0 2   =   ' T h e   a r e a   a t t r i b u t e   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 0 3   =   ' T h e   h e a t i n g   a r e a   a t t r i b u t e   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 0 4   =   ' T h e   c o o l i n g   a r e a   a t t r i b u t e   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 2 5 0 5   =   ' T h e   p o p u l a t i o n   a t t r i b u t e   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 0 6   =   ' T h e   a r e a   a t t r i b u t e   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 0 7   =   ' T h e   h e a t i n g   a r e a   a t t r i b u t e   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 0 8   =   ' T h e   c o o l i n g   a r e a   a t t r i b u t e   i s   m i s s i n g ,   a n d   c h a r t   c a n n o t   b e   d r a w n .   P l e a s e   t r y   a g a i n   a f t e r   s e t t i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 0 9   =   ' T h e   e n e r g y   l a b e l i n g   h a s   b e e n   d e l e t e d .   P l e a s e   s e l e c t   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 0   =   ' T h i s   e n e r g y   l a b e l i n g   h a s   n o   d a t a .   P l e a s e   s e l e c t   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 1   =   ' C a n   n o t   d r a w   c h a r t   b e c a u s e   m i s s i n g   r o o m   p r o p e r t y ,   p l e a s e   s e t   i t   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 2   =   ' C a n   n o t   d r a w   c h a r t   b e c a u s e   m i s s i n g   u s e d   r o o m   p r o p e r t y ,   p l e a s e   s e t   i t   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 3   =   ' C a n   n o t   d r a w   c h a r t   b e c a u s e   m i s s i n g   b e d   p r o p e r t y ,   p l e a s e   s e t   i t   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 4   =   ' C a n   n o t   d r a w   c h a r t   b e c a u s e   m i s s i n g   u s e d   b e d   p r o p e r t y ,   p l e a s e   s e t   i t   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 5   =   ' C a n   n o t   d r a w   c h a r t   b e c a u s e   m i s s i n g   r o o m   p r o p e r t y ,   p l e a s e   s e t   i t   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 6   =   ' C a n   n o t   d r a w   c h a r t   b e c a u s e   m i s s i n g   u s e d   r o o m   p r o p e r t y ,   p l e a s e   s e t   i t   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 7   =   ' C a n   n o t   d r a w   c h a r t   b e c a u s e   m i s s i n g   b e d   p r o p e r t y ,   p l e a s e   s e t   i t   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 5 1 8   =   ' C a n   n o t   d r a w   c h a r t   b e c a u s e   m i s s i n g   u s e d   b e d   p r o p e r t y ,   p l e a s e   s e t   i t   a n d   t r y   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 7 0 1   =   ' S o m e   o f   t h e   s e l e c t e d   h i e r a r c h y   h a s   b e e n   d e l e t e d , a n d   c a n n o t   b e   r a n k e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 8 0 9   =   ' T h e   a r e a   o f   t h e   s e l e c t e d   t a g   d o e s   n o t   s u p p o r t   t h e   w e a t h e r   f u n c t i o n . ' ;  
 I 1 8 N . M e s s a g e . M 0 2 8 1 0   =   ' T h e   a r e a   o f   t h e   s e l e c t e d   t a g   d o e s   n o t   s u p p o r t   t h e   w e a t h e r   f u n c t i o n . ' ;  
  
 / * * * * * *  
   *   C a r b o n  
   * * * * * * /  
 I 1 8 N . M e s s a g e . M 0 3 0 0 5   =   ' T h e   c o n v e r s i o n   f a c t o r   i s   t h e   s a m e   a s   b e f o r e ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 0 8   =   ' T h i s   c o n v e r s i o n   i s   n o t   i n   l i n e   w i t h   t h e   t a r g e t , a n d   t h e   c o n v e r s i o n   f a c t o r   c a n n o t   b e   s a v e d . ' ;  
  
 / * * * * * *  
   *   T O U   T a r i f f   E r r o r   C o d e  
   * * * * * * /  
 I 1 8 N . M e s s a g e . M 0 3 0 2 5   =   ' T h e   p r i c e   p o l i c y   c o n f i g u r a t i o n   h a s   b e e n   m o d i f i e d   b y   o t h e r   u s e r s ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 2 9   =   ' P e a k   s e a s o n   d o e s   n o t   e x i s t ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 3 0   =   ' Y o u   c a n n o t   s a v e   a n   e m p t y   p r i c i n g   p o l i c y . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 3 2   =   ' T h e   f l a t   l o a d   p o w e r   p r i c e   h a s   n o t   b e e n   s e t   u p .   M a k e   s u r e   t h e   p e a k   a n d   v a l l e y   p e r i o d s   f i l l   2 4   h o u r s . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 3 3   =   ' P r i c i n g   p o l i c y   m u s t   i n c l u d e   t h e   p r i c e   f o r   p e a k   a n d   v a l l e y   p e r i o d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 3 4   =   ' P e a k   t i m e   p e r i o d   i s   e m p t y ,   a n d   i t   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 3 5   =   ' T i m e   p e r i o d s   a r e   o v e r l a p p e d .   P l e a s e   c h e c k   i t . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 3 8   =   ' T i m e   p e r i o d s   a r e   o v e r l a p p e d .   P l e a s e   c h e c k   i t . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 3 9   =   ' P e a k   t i m e   p e r i o d   i s   e m p t y ,   a n d   i t   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 4 0   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 4 1   =   ' P e a k   s e a s o n   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 4 2   =   ' T h i s   e n t r y   c a n   o n l y   b e   a   p o s i t i v e   n u m b e r ' ;  
  
 / * * * * * *  
   *   C a l e n d a r  
   * * * * * * /  
 I 1 8 N . M e s s a g e . M 0 3 0 5 2   =   ' C a l e n d a r   e n d   d a t e   m u s t   b e   g r e a t e r   t h a n   o r   e q u a l   t o   t h e   s t a r t   d a t e . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 5 3   =   ' T i m e   p e r i o d s   a r e   o v e r l a p p e d .   P l e a s e   c h e c k   i t . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 5 4   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 5 7   =   ' T i m e   p e r i o d s   a r e   o v e r l a p p e d .   P l e a s e   c h e c k   i t . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 5 8   =   ' C a l e n d a r   h a s   b e e n   c i t e d ,   a n d   c a n n o t   b e   d e l e t e d . ' ;   / / - - - - - - - - - - - - - -  
 I 1 8 N . M e s s a g e . M 0 3 0 5 9   =   ' D a t e s   i n   F e b r u a r y   c a n n o t   b e   2 9 / 3 0 / 3 1 . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 6 0   =   ' D a t e   i n   S a t s u k i   c a n n o t   b e   3 1 . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 6 1   =   ' A d d   a t   l e a s t   o n e   h e a t i n g   s e a s o n   o r   c o o l i n g   s e a s o n . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 6 2   =   ' H e a t i n g   s e a s o n   a n d   c o o l i n g   s e a s o n   c a n n o t   f a l l   i n   t h e   s a m e   m o n t h . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 6 3   =   ' T i m e   d i f f e r e n c e   b e t w e e n   t h e   h e a t i n g   s e a s o n   a n d   c o o l i n g   s e a s o n   c a n n o t   b e   l e s s   t h a n   s e v e n   d a y s . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 9 0 2   =   ' P r i c e   p o l i c y   n a m e   e x c e e d s   1 0 0   c h a r a c t e r s ' ;  
 I 1 8 N . M e s s a g e . M 0 3 9 0 3   =   ' P r i c e   p o l i c y   n a m e   c o n t a i n s   i l l e g a l   c h a r a c t e r s ' ;  
  
 / * * * * *  
 l a b e l i n g  
 * * * * * * /  
 I 1 8 N . M e s s a g e . M 0 3 0 8 0   =   ' E n e r g y   l a b e l i n g   a l r e a d y   e x i s t s .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 8 1   =   ' E n e r g y   l a b e l i n g   h a s   b e e n   d e l e t e d .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 8 2   =   ' E n e r g y   l a b e l i n g   h a s   b e e n   m o d i f i e d   b y   a n o t h e r   u s e r .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 8 3   =   ' N o   r e g i o n   i s   s e t   f o r   e n e r g y   l a b e l i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 8 4   =   ' L a b e l i n g   l e v e l   i s   w r o n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 8 5   =   ' T h e   y e a r   o f   t h e   d a t a   s o u r c e   o f   t h e   e n e r g y   l a b e l i n g   i s   w r o n g . ' ;  
  
 / * * * * * *  
 S y s t e m D i m e n s i o n   E r r o r   C o d e ,   N O T E   t h a t   f o r   e r r o r   o f  
 0 4 0 5 0 , 0 4 0 5 2 , 0 4 0 5 3 , 0 4 0 5 4 ,  
 r e f r e s h   i s   n e e d e d .  
 0 4 0 5 1   s h o u l d   r e f r e s h   h i e r a r c h y   t r e e  
 * * * * * * * /  
 I 1 8 N . M e s s a g e . M 0 4 0 5 2   =   ' B e f o r e   c h e c k i n g   t h e   c u r r e n t   d i m e n s i o n   n o d e ,   m a k e   s u r e   i t s   p a r e n t   n o d e   h a s   b e e n   c h e c k e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 4 0 5 4   =   ' B e f o r e   u n c h e c k i n g   t h e   c u r r e n t   d i m e n s i o n   n o d e ,   m a k e   s u r e   t h a t   a l l   o f   i t s   c h i l d   n o d e s   a r e   n o t   c h e c k e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 4 0 5 5   =   ' T h e   c u r r e n t   s y s t e m   d i m e n s i o n   n o d e   h a s   n o   c h i l d   n o d e . ' ;   / / f o r   e n e r g y   v i e w   s i n g l e   t a g   t o   p i e   c h a r t  
 I 1 8 N . M e s s a g e . M 0 4 0 5 6   =   ' U n a b l e   t o   d e l e t e   t h e   s y s t e m   d i m e n s i o n   n o d e .   P l e a s e   d e l e t e   a l l   t h e   t a g   a s s o c i a t i o n s   u n d e r   t h i s   n o d e . ' ;  
 / * * * * * *  
 D a s h b o a r d   E r r o r   C o d e ,   N O T E   t h a t   f o r   e r r o r   o f  
 0 5 0 0 2  
 r e f r e s h   i s   n e e d e d .  
 0 5 0 1 1   s h o u l d   r e f r e s h   h i e r a r c h y   t r e e  
 * * * * * * * /  
 I 1 8 N . M e s s a g e . M 0 5 0 0 1   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 1 1   =   ' T h e   h i e r a r c h y   n o d e s   c o r r e s p o n d i n g   t o   t h i s   d a s h b o a r d   h a v e   b e e n   d e l e t e d ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d   i m m e d i a t e l y . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 1 3   =   ' N u m b e r   o f   d a s h b o a r d   o f   t h i s   h i e r a r c h y   n o d e   h a s   r e a c h e d   t h e   u p p e r   l i m i t . P l e a s e   d e l e t e   s o m e   c o n t e n t   t o   c o n t i n u e . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 1 4   =   ' C o n t e n t s   i n   " M y   F a v o r i t e s "   h a s   r e a c h e d   t h e   u p p e r   l i m i t .   P l e a s e   d e l e t e   s o m e   c o n t e n t   t o   c o n t i n u e . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 1 5   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 1 6   =   ' N u m b e r   o f   w i d g e t s   i n   t h e   d a s h b o a r d   h a s   r e a c h e d   t h e   u p p e r   l i m i t ,   a n d   y o u   c a n n o t   c r e a t e   a   n e w   w i d g e t . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 1 7   =   ' T h e   I D   o f   d a s h b o a r d s   f o r   a l l   w i d g e t s   a r e   n o t   e x a c t l y   t h e   s a m e . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 5 0 2 3   =   ' { 0 } { 1 } ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 2 3 _ S u b 0   =   ' T h e   f o l l o w i n g   u s e r   I D   h a v e   b e e n   d e l e t e d :   { 0 } . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 2 3 _ S u b 1   =   ' U n a b l e   t o   s h a r e   w i t h   t h e s e   p e o p l e :   { 0 } . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 3 2   =   ' S a m e   r o o m   e x i s t e d ' ;  
  
 / * * * * * *  
 T a g   E r r o r   C o d e ,   N O T E   t h a t   f o r   e r r o r   o f   0 6 0 0 1 ,   0 6 1 1 7 , 0 6 1 5 2 , 0 6 1 3 9 , 0 6 1 5 4 , 0 6 1 5 6 ,   r e f r e s h   i s   n e e d e d .  
 * * * * * * * /  
  
 I 1 8 N . M e s s a g e . M 0 6 1 0 0   =   ' T a g   h a s   b e e n   d e l e t e d   a n d   c a n n o t   b e   l o a d e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 0 4   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 0 7   =   ' T h e   c o d e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 0 9   =   ' T h e   c h a n n e l   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 2 2   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 2 7   =   ' T h e   c o d e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 3 3   =   ' F o r m a t   o f   t h e   f o r m u l a   i s   i n c o r r e c t ,   p l e a s e   c h e c k   i t . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 3 4   =   ' T h e   f o r m u l a   o f   v i r t u a l   t a g s   i n c l u d e s   i l l e g a l   d a t a   p o i n t s ,   a n d   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 3 6   =   ' T h e   f o r m u l a   o f   v i r t u a l   t a g s   i n c l u d e s   l o o p   c a l l i n g ,   a n d   c a n n o t   b e   s a v e d . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 6 1 5 6   =   ' T h e   f o r m u l a   o f   v i r t u a l   t a g s   i n c l u d e s   i l l e g a l   t a g s ,   a n d   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 6 0   =   ' T h e   m e d i a   a n d   u n i t   o f   t h e   p h y s i c a l   t a g s   d o e s   n o t   m a t c h , a n d   i t   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 6 1   =   ' T h e   m e d i a   a n d   u n i t   o f   t h e   v i r t u a l   t a g s   d o e s   n o t   m a t c h , a n d   i t   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 6 4   =   ' T h e   c a l c u l a t i o n   s t e p   s i z e   o f   v i r t u a l   t a g s   i s   i l l e g a l   a n d   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 7 4   =   ' T y p e   o f   t h e     p h y s i c a l   t a g s   i s   i l l e g a l   a n d   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 8 2   =   ' { 0 }   " { 1 } "   a r e   b e i n g   r e f e r e n c e d ,   s o   i t   c a n n o t   b e   d e l e t e d .   P l e a s e   c a n c e l   a l l   r e f e r e n c e s   a n d   t r y   a g a i n .   < b r / >   r e f e r e n c e d   o b j e c t s :   { 2 } ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 8 3   =   ' T h e   t a g   h a s   e x p i r e d .   T h e   t a g   m a y   h a v e   b e e n   m o d i f i e d   o r   d e l e t e d   b y   o t h e r s .   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 8 6   =   ' T h e   c o r r e s p o n d i n g   t a g   a l r e a d y   h a s   e n e r g y   c o n s u m p t i o n   t a g s   o f   t h e   s a m e   m e d i a .     ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 9 2   =   ' T h e   c a l c u l a t i o n   s t e p   s i z e   o f   d a y - n i g h t   r a t i o   t a g   m u s t   b e   g r e a t e r   t h a n   o r   e q u a l   t o   o n e   d a y . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 9 3   =   ' T h e   c h i l d   n o d e s   o f   t h e   c u r r e n t   h i e r a r c h y   n o d e   d o e s   n o t   i n c l u d e   t a g s   t h a t   s h a r e s   t h e   s a m e   m e d i a   w i t h   t h i s   t a g .   ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 9 4   =   ' T h e   c h i l d   n o d e s   o f   t h e   c u r r e n t   s y s t e m   d i m e n s i o n   d o e s   n o t   i n c l u d e   t a g s   t h a t   s h a r e s   t h e   s a m e   m e d i a   w i t h   t h i s   t a g .   ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 9 5   =   ' T h e   c h i l d   n o d e s   o f   t h e   c u r r e n t   r e g i o n a l   d i m e n s i o n   d o e s   n o t   i n c l u d e   t a g s   t h a t   s h a r e s   t h e   s a m e   m e d i a   w i t h   t h i s   t a g .   ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 9 6   =   ' T h e   c u r r e n t   h i e r a r c h y   n o d e   d o e s   n o t   i n c l u d e   t a g s   t h a t   s h a r e s   t h e   s a m e   m e d i a   u n i t   w i t h   t h i s   t a g .   ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 9 7   =   ' T h e   c u r r e n t   s y s t e m   d i m e n s i o n   d o e s   n o t   i n c l u d e   t a g s   t h a t   s h a r e s   t h e   s a m e   m e d i a   w i t h   t h i s   t a g .   ' ;  
 I 1 8 N . M e s s a g e . M 0 6 1 9 8   =   ' T h e   c u r r e n t   r e g i o n a l   d i m e n s i o n   d o e s   n o t   i n c l u d e   t a g s   t h a t   s h a r e s   t h e   s a m e   m e d i a   w i t h   t h i s   t a g .   ' ;  
 I 1 8 N . M e s s a g e . M 0 6 2 0 1   =   ' C a n n o t   m o d i t y   t h e   c a c u l a t e d   i n t e r v a l   t o  { 0 }  0T h i s   t a g   h a s   b e e n   r e f e r r e d   t o   b y   o t h e r   t a g s .   N e w l y   c a l c u l a t e d   i n t e r v a l   m u s t   b e   s m a l l e r   o r   e q u a l   t o   t h e   c a l c u l a t e d   i n t e r v a l   o f   t h e   t a g   r e f e r r e d   t o . ' ;  
 I 1 8 N . M e s s a g e . M 0 6 2 0 2   =   ' T h e   c o r r e s p o n d i n g   t a g   a l r e a d y   h a s   e n e r g y   c o n s u m p t i o n   t a g s   o f   t h e   s a m e   m e d i a .     ' ;  
 I 1 8 N . M e s s a g e . M 0 6 2 0 3   =   ' T h i s   t a g   i s   n o t   a n   e n e r g y   c o n s u m p t i o n   t a g . ' ;  
  
  
 I 1 8 N . M e s s a g e . M 0 7 0 0 1   =   ' D a t a   a u t h o r i t y   h a s   b e e n   m o d i f i e d   b y   a n o t h e r   u s e r .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 7 0 0 0   =   ' N o   F u n c t i o n   a u t h o r i t y . ' ;  
 I 1 8 N . M e s s a g e . M 0 7 0 0 9   =   ' N o   d a t a   a u t h o r i t y . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 7 0 1 0   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 0 7 0 1 1   =   ' T h e   r o l e   h a s   b o u n d   a   u s e r   a n d   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 7 0 2 1   =   ' H i e r a r c h y   n o d e   d o e s   n o t   e x i s t   o r   h a s   b e e n   d e l e t e d ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
  
 / *  
 A r e a D i m e n s i o n N o d e N a m e D u p l i c a t e   =   2 0 8 ,  
 A r e a D i m e n s i o n N o d e L e v e l O v e r L i m i t a t i o n   =   2 0 9 ,  
 A r e a D i m e n s i o n N o d e H a s N o P a r e n t   =   2 1 0 ,  
 A r e a D i m e n s i o n N o d e H a s B e e n D e l e t e d   =   2 1 1 ,  
 A r e a D i m e n s i o n N o d e H a s C h i l d r e n   =   2 1 2 ,  
 A r e a D i m e n s i o n N o d e H a s B e e n M o d i f i e d   =   2 1 3 ,  
 * /  
 I 1 8 N . M e s s a g e . M 0 8 2 0 0   =   ' H i e r a r c h y   n o d e   a s s o c i a t e d   w i t h   t h e   d i m e n s i o n   n o d e   h a s   b e e n   d e l e t e d ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 8 2 0 8   =   ' D u p l i c a t e   n a m e ' ;  
 I 1 8 N . M e s s a g e . M 0 8 2 0 9   =   ' L e v e l   o f   t h e   c u r r e n t   d i m e n s i o n   n o d e   e x c e e d s   t h e   m a x i m u m   l e n g t h ,   a n d   c a n n o t   b e   s a v e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 8 2 1 0   =   ' T h e   p a r e n t   n o d e   o f   t h e   c u r r e n t   d i m e n s i o n   n o d e   h a s   b e e n   d e l e t e d ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 8 2 1 1   =   ' T h e   c u r r e n t   d i m e n s i o n s   n o d e   h a s   b e e n   d e l e t e d   b y   o t h e r s ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 8 2 1 2   =   ' U n a b l e   t o   d e l e t e   t h i s   r e g i o n a l   d i m e n s i o n   n o d e .   P l e a s e   d e l e t e   a l l   c h i l d   n o d e s   u n d e r   t h i s   n o d e . ' ;  
 I 1 8 N . M e s s a g e . M 0 8 2 1 4   =   ' T h e   c u r r e n t   r e g i o n a l   d i m e n s i o n   n o d e   h a s   n o   c h i l d   n o d e s . ' ;   / / f o r   e n e r g y   v i e w   s i n g l e   t a g   t o   p i e   c h a r t  
 I 1 8 N . M e s s a g e . M 0 8 2 1 5   =   ' U n a b l e   t o   d e l e t e   t h i s   r e g i o n a l   d i m e n s i o n   n o d e .   P l e a s e   d e l e t e   a l l   t a g   a s s o c i a t i o n s   u n d e r   t h i s   n o d e . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 9 0 0 1   =   ' D a t a   h a s   b e e n   d e l e t e d ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 0 0 2   =   ' D a t a   h a s   b e e n   m o d i f i e d   b y   o t h e r s ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 1 0 7   =   ' D a t a   h a s   b e e n   m o d i f i e d   b y   o t h e r s ,   c l i c k   " O K "   t o   r e l o a d   d a t a . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 1 1 2   =   ' T h e   c o r r e s p o n d i n g   t a g s   h a v e   b e e n   d e l e t e d .   T h e   p a g e   w i l l   b e   r e f r e s h e d   i m m e d i a t e l y . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 1 1 3   =   ' P l e a s e   s e t   c a l c u l a t i o n   r u l e s   b e f o r e   d o i n g   t h e   c a l c u l a t i o n . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 1 1 4   =   ' V a l u e   e x c e e d s   t h e   l e g a l   r a n g e ,   a n d   i t   c a n n o t   b e   s a v e d .   T h e   r a n g e   o f   v a l i d   v a l u e s     i s   - 9 9 9 9 9 9 9 9 9 . 9 9 9 9 9 9   ~   9 9 9 , 9 9 9 , 9 9 9 . 9 9 9 9 9 9 . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 1 5 5   =   I 1 8 N . f o r m a t ( I 1 8 N . M e s s a g e . U p d a t e C o n c u r r e n c y ,   ' ���{<P' ) ;  
 I 1 8 N . M e s s a g e . M 0 9 1 5 7   =   ' T h e   c o r r e s p o n d i n g   t a g s   h a v e   b e e n   d e l e t e d .   T h e   p a g e   w i l l   b e   r e f r e s h e d   i m m e d i a t e l y . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 1 5 8   =   ' T a g s   a r e   n o t   a s s o c i a t e d   t o   t h e   h i e r a r c h y   t r e e   a n d   d i m e n s i o n   t r e e .   P l e a s e   a s s o c i a t e   t a g s   f i r s t . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 1 5 9   =   ' T h e   c a l e n d a r   a t t r i b u t e   o f   t h e   h i e r a r c h y   t r e e   a s s o c i a t e d   i s   e m p t y .   P l e a s e   s e t   t h e   c a l e n d a r   f o r   t h e   h i e r a r c h y   t r e e   f i r s t . ' ;  
 I 1 8 N . M e s s a g e . M 0 9 1 6 0   =   ' T h e   c a l e n d a r   a t t r i b u t e   o f   t h e   h i e r a r c h y   t r e e   a s s o c i a t e d   f o r   t h i s   y e a r   i s   e m p t y .   P l e a s e   s e t   t h e   c a l e n d a r   a t t r i b u t e   f o r   t h i s   y e a r   f o r   t h e   h i e r a r c h y   t r e e   f i r s t . ' ;  
  
 / / C o s t   c o n c u r r e n c y   e r r o r  
 I 1 8 N . M e s s a g e . M 1 0 0 0 7   =   ' P e a k / v a l l e y / n o r m a l   p r i c e   c a n n o t   b e   s h o w n   b y   h o u r     ' ;  
 I 1 8 N . M e s s a g e . M 1 0 0 1 5   =   ' D a t a   o f   t h e   s a m e   h i e r a r c h y   n o d e   a l r e a d y   e x i s t s , a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d ' ;  
 I 1 8 N . M e s s a g e . M 1 0 0 1 9   =   ' D e m a n d   c o s t   T a g   i s   i n v a l i d   d a t a ' ;  
 I 1 8 N . M e s s a g e . M 1 0 0 2 0   =   ' R e a c t i v e   p o w e r   t a g   i s   i n v a l i d   d a t a ' ;  
 I 1 8 N . M e s s a g e . M 1 0 0 2 1   =   ' A c t i v e   p o w e r   t a g   i s   i n v a l i d   d a t a ' ;  
  
 I 1 8 N . M e s s a g e . M 1 1 0 1 2   =   ' T h e   c u s t o m e r   i s   c i t e d   b y   h i e r a r c h y   a n d   c a n n o t   b e   d e l e t e d ! ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 5 1   =   ' D u p l i c a t e   c o d e ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 5 2   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 5 4   =   ' I m a g e   f i l e   i s   t o o   l a r g e .   P l e a s e   u p l o a d   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 5 5   =   ' I m a g e   s i z e   i s   t o o   l a r g e .   P l e a s e   u p l o a d   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 5 6   =   ' O n l y   G I F / P N G   i m a g e s   c a n   b e   u p l o a d e d .   P l e a s e   u p l o a d   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 5 7   =   ' C u s t o m e r   i n f o r m a t i o n   h a s   b e e n   d e l e t e d   b y   o t h e r   u s e r s ,   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 5 8   =   ' C u s t o m e r s   h a v e   b e e n   c i t e d   b y   o t h e r   d a t a   a n d   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 4 0 4   =   ' T h e   c u s t o m e r   i s   c i t e d   b y   u s e r   a n d   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 4 0 8   =   ' T h e   c u s t o m e r   i s   c i t e d   b y   t a g s   a n d   c a n n o t   b e   d e l e t e d . ' ;  
  
  
 I 1 8 N . M e s s a g e . M 1 2 0 0 1   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 0 3   =   ' I n c o r r e c t   p a s s w o r d   ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 0 6   =   ' D e f a u l t   p l a t f o r m   a d m i n i s t r a t o r   a c c o u n t   c a n n o t   b e   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 0 8   =   ' T h e   u s e r   h a s   b e e n   d e l e t e d .   T h e   p a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 0 9   =   ' Y o u   c a n n o t   d e l e t e   y o u r   o w n   a c c o u n t . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 1 0   =   ' Y o u   c a n n o t   m o d i f y   s o m e o n e   e l s e    p a s s w o r d . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 1 1   =   ' Y o u   c a n n o t   m o d i f y   s o m e o n e   e l s e    d a t a . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 5 0   =   ' I m a g e   f i l e   i s   t o o   l a r g e ,   u p l o a d   f a i l e d .   P l e a s e   u p l o a d   a g a i n . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 5 1   =   ' P l e a s e   u p l o a d   j p g   /   p n g   /   g i f   /   b m p   i m a g e s ' ;  
 I 1 8 N . M e s s a g e . M 1 2 0 5 2   =   ' F e e d b a c k   m e s s a g e   w a s   n o t   s e n t   s u c c e s s f u l l y . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 1 0 0   =   ' U s e r   n a m e   d o e s   n o t   e x i s t . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 1 0 1   =   ' E m a i l   a d d r e s s   e r r o r ' ;  
 I 1 8 N . M e s s a g e . M 1 2 1 0 2   =   ' T h e   l i n k   f o r   r e s e t t i n g   p a s s w o r d   i s   i n c o r r e c t . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 1 0 3   =   ' L i n k   h a s   e x p i r e d ! ' ;  
 I 1 8 N . M e s s a g e . M 1 2 1 0 5   =   ' S e r v i c e   p r o v i d e r   h a s   b e e n   s u s p e n d e d !   P l e a s e   c o n t a c t   t h e   a d m i n i s t r a t o r . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 1 0 6   =   ' S e r v i c e   p r o v i d e r   h a s   b e e n   d e l e t e d !   P l e a s e   c o n t a c t   t h e   a d m i n i s t r a t o r . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 1 0 7   =   ' Y o u r   u s e r   h a s   b e e n   d e l e t e d !   P l e a s e   c o n t a c t   t h e   a d m i n i s t r a t o r . ' ;  
 I 1 8 N . M e s s a g e . M 1 2 1 0 8   =   ' C a n n o t   s e n d   i t   t o   n o n - t r i a l   u s e r s ! ' ;  
  
  
 I 1 8 N . M e s s a g e . M 1 3 0 0 1   =   ' T a g s   h a v e   b e e n   d e l e t e d   b y   o t h e r   u s e r s ! ' ;  
 I 1 8 N . M e s s a g e . M 1 3 0 0 2   =   ' A l a r m   h a s   b e e n   d e l e t e d   b y   o t h e r   u s e r s ! ' ;  
 I 1 8 N . M e s s a g e . M 1 3 0 0 3   =   ' A l a r m   h a s   b e e n   m o d i f i e d   b y   o t h e r   u s e r s ! ' ;  
 I 1 8 N . M e s s a g e . M 1 3 0 1 1   =   ' C a l e n d a r   h a s   b e e n   d e l e t e d   b y   o t h e r   u s e r s ! ' ;  
  
 I 1 8 N . M e s s a g e . M 1 3 0 1 5   =   ' A l a r m   h a s   b e e n   c o n f i g u r e d   b y   o t h e r   u s e r s ! ' ;  
 I 1 8 N . M e s s a g e . M 1 3 0 1 6   =   ' U s e r s   h a v e   b e e n   d e l e t e d   b y   o t h e r   u s e r s ! ' ;  
  
 I 1 8 N . M e s s a g e . M 1 4 0 0 1   =   ' S e r v i c e   p r o v i d e r   h a s   b e e n   m o d i f i e d   b y   o t h e r   u s e r s ! ' ;  
 I 1 8 N . M e s s a g e . M 1 4 0 0 2   =   ' D u p l i c a t e   s e r v i c e   p r o v i d e r   I D ! ' ;  
 I 1 8 N . M e s s a g e . M 1 4 0 0 3   =   ' S e r v i c e   p r o v i d e r   h a s   b e e n   d e l e t e d   b y   o t h e r   u s e r s ! ' ;  
 I 1 8 N . M e s s a g e . M 1 4 0 0 4   =   ' S e r v i c e   p r o v i d e r   h a s   b e e n   s u s p e n d e d ! ' ;  
 I 1 8 N . M e s s a g e . M 1 4 0 0 5   =   ' S e r v i c e   p r o v i d e r   d o e s   n o t   h a v e   a n   a d m i n i s t r a t o r ! ' ;  
 I 1 8 N . M e s s a g e . M 1 4 0 0 6   =   ' S e r v i c e   p r o v i d e r   i s   b e i n g   e s t a b l i s h e d .   P l e a s e   t r y   a g a i n   l a t e r ! ' ;  
  
 I 1 8 N . M e s s a g e . M 1 1 3 6 4   =   ' M a p   s h e e t   i n f o r m a t i o n   a l r e a d y   e x i s t s .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 6 5   =   ' A t   l e a s t   o n e   m a p   s h e e t   i n f o r m a t i o n   i s   i n c l u d e d . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 6 6   =   ' C u s t o m e r   h a s   b e e n   d e l e t e d .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 3 6 7   =   ' M a p   s h e e t   i n f o r m a t i o n   h a s   b e e n   m o d i f i e d   b y   o t h e r s .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 7 0   =   ' I n d u s t r y   l a b e l i n g   a l r e a d y   e x i s t s .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 7 1   =   ' I n d u s t r y   l a b e l i n g   h a s   b e e n   d e l e t e d .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 7 2   =   ' I n d u s t r y   l a b e l i n g   h a s   b e e n   m o d i f i e d   b y   a n o t h e r   u s e r .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 3 0 7 3   =   ' N o   r e g i o n   i s   s e t   f o r   i n d u s t r y   l a b e l i n g . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 5 0 0   =   ' M a p   i n f o r m a t i o n   a l r e a d y   e x i s t s .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 5 0 1   =   ' M a p   i n f o r m a t i o n   h a s   b e e n   d e l e t e d   b y   a n o t h e r   u s e r .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 5 0 2   =   ' M a p   i n f o r m a t i o n   h a s   b e e n   m o d i f i e d   b y   a n o t h e r   u s e r .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 1 5 0 7   =   ' B u i l d i n g   n o d e   h a s   b e e n   d e l e t e d   b y   a n o t h e r   u s e r .   P a g e   w i l l   b e   r e f r e s h e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 2 5   =   ' T h e   s h a r e   h a s   b e e n   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 2 4   =   ' T h e   u s e r   h a s   b e e n   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 2 7   =   ' T h e   s u b s c r i b e r   h a s   b e e n   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 5 0 2 8   =   ' T h e   s u b s c r i b e r   h a s   b e e n   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 0 0 9 5 3   =   ' I l l e g a l   e n t r y . ' ;  
  
 I 1 8 N . M e s s a g e . M 1 1 6 0 0   =   ' T h e   c u s t o m i z e d   l a b e l i n g   a l r e a d y   e x i s t s   u n d e r   t h i s   c u s t o m e r .   P l e a s e   u s e   a n o t h e r   n a m e . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 6 0 1   =   ' W r o n g   u s e r - d e f i n e d   e n e r g y   l a b e l i n g . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 6 0 2   =   ' U s e r - d e f i n e d   e n e r g y   l a b e l i n g   l e v e l s   a r e   d i s c o n t i n u o u s . ' ;  
 I 1 8 N . M e s s a g e . M 1 1 6 0 3   =   ' C o n c u r r e n c y   e r r o r .   P l e a s e   r e f r e s h . ' ;  
  
 I 1 8 N . M e s s a g e . M 0 5 0 0 3   =   ' I l l e g a l   e n t r y . ' ;  
  
 I 1 8 N . M e s s a g e . M 2 0 0 0 1   =   ' D u p l i c a t e   r u l e   n a m e s . ' ;  
 I 1 8 N . M e s s a g e . M 2 0 0 0 2   =   ' R u l e   h a s   b e e n   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 2 0 0 0 3   =   ' R u l e   h a s   b e e n   m o d i f i e d . ' ;  
 I 1 8 N . M e s s a g e . M 2 0 0 0 6   =   ' C u s t o m e r   h a s   b e e n   d e l e t e d . ' ;  
 I 1 8 N . M e s s a g e . M 2 0 0 0 7   =   ' T o t a l   n u m b e r   o f   r u l e s   e x c c e d s   l i m i t . ' ;  
 I 1 8 N . M e s s a g e . M 2 0 0 1 2   =   ' S o m e   o f   t h e   t a g s   h a v e   b e e n   a s s o c i a t e d   t o   o t h e r   r u l e s . ' ;  
 I 1 8 N . M e s s a g e . M 2 0 0 1 3   =   ' Y o u   c a n n o t   m o d i f y   t h e   d a t a   u n d e r   t h e   f o l l o w i n g   t a g s :   { 0 } . ' ;  
 I 1 8 N . M e s s a g e . M 2 0 0 1 4   =   ' S o m e   o f   t h e   t a g s   h a v e   b e e n   d e l e t e d   o r   h a v e   n o   d a t a   a c c e s s . ' ;  
  
 I 1 8 N . M e s s a g e . M 2 1 7 0 7   =   ' R e p o r t   { 0 }   i s   d e l e t e d .   W i l l   r e f r e s h   r e p o r t   l i s t   s o o n . ' ;  
 I 1 8 N . M e s s a g e . M 2 1 7 0 5   =   ' D u p l i c a t e   r e p o r t   t i t l e     ' ;  
 I 1 8 N . M e s s a g e . M 2 1 7 0 2   =   ' T h e   r e p o r t   h a s   b e e n   m o d i f i e d   a n d   t h e   p a g e   w i l l   b e   r e f r e s h e d   i m m e d i a t e l y . ' ;  
 I 1 8 N . M e s s a g e . M 2 1 7 0 6   =   ' T h e   r e p o r t   h a s   d u p l i c a t e   T a g ,   p l e a s e   c h e c k   i t . ' ;  
  
 I 1 8 N . F o l d e r   =   { } ;  
 I 1 8 N . F o l d e r . N e w W i d g e t   =   { } ;  
 I 1 8 N . F o l d e r . N e w W i d g e t . M e n u 1   =   ' E n e r g y   a n a l y s i s     ' ;  
 I 1 8 N . F o l d e r . N e w W i d g e t . M e n u 2   =   ' U n i t   i n d e x ' ;  
 I 1 8 N . F o l d e r . N e w W i d g e t . M e n u 3   =   ' T i m e   r a t i o ' ;  
 I 1 8 N . F o l d e r . N e w W i d g e t . M e n u 4   =   ' L a b e l i n g ' ;  
 I 1 8 N . F o l d e r . N e w W i d g e t . M e n u 5   =   ' R a n k i n g ' ;  
 I 1 8 N . F o l d e r . N e w W i d g e t . D e f a u l t N a m e   =   ' L a s t   7   D a y s   { 0 } ' ;  
  
 I 1 8 N . F o l d e r . N e w F o l d e r   =   ' N e w   f o l d e r ' ;  
 I 1 8 N . F o l d e r . F o l d e r N a m e   =   ' F o l d e r ' ;  
 I 1 8 N . F o l d e r . W i d g e t N a m e   =   ' C h a r t ' ;  
 I 1 8 N . F o l d e r . W i d g e t S a v e S u c c e s s   =   ' T h e   c h a r t   h a s   b e e n   s a v e d   s u c c e s s f u l l y . ' ;  
  
 I 1 8 N . F o l d e r . S a v e N a m e E r r o r   =   { } ;  
 I 1 8 N . F o l d e r . S a v e N a m e E r r o r . E 0 3 2   =   ' { 1 }   n a m e d   " { 0 } "   a l r e a d y   e x i s t s .   P l e a s e   c h o o s e   a n o t h e r   n a m e . ' ;  
 I 1 8 N . F o l d e r . S a v e N a m e E r r o r . E 0 2 9   =   ' N a m e   { 0 }   c a n n o t   b e   l e f t   e m p t y .   P l e a s e   e n t e r   a g a i n . ' ;  
 I 1 8 N . F o l d e r . S a v e N a m e E r r o r . E 0 3 1   =   ' N a m e   { 0 }   e x c e e d s   t h e   m a x i m u m   l e n g t h   o f   1 0 0 .   P l e a s e   e n t e r   a g a i n . ' ;  
  
 I 1 8 N . F o l d e r . C o p y   =   { } ;  
 I 1 8 N . F o l d e r . C o p y . T i t l e   =   ' C o p y   { 0 } ' ;  
 I 1 8 N . F o l d e r . C o p y . L a b e l   =   ' { 0 }   N a m e ' ;  
 I 1 8 N . F o l d e r . C o p y . f i r s t A c t i o n L a b e l   =   ' C o p y ' ;  
 I 1 8 N . F o l d e r . C o p y . E r r o r   =   ' T h e   n a m e   a l r e a d y   e x i s t s . ' ;  
 I 1 8 N . F o l d e r . C o p y . N a m e L o n g E r r o r   =   ' Y o u   c a n n o t   e n t e r   m o r e   t h a n   1 0 0   c h a r a c t e r s ' ;  
  
 I 1 8 N . F o l d e r . S a v e A s   =   { } ;  
 I 1 8 N . F o l d e r . S a v e A s . T i t l e   =   ' C o p y   c h a r t   ' ;  
 I 1 8 N . F o l d e r . S a v e A s . L a b e l   =   ' C h a r t   n a m e     ' ;  
 I 1 8 N . F o l d e r . S a v e A s . f i r s t A c t i o n L a b e l   =   ' S a v e ' ;  
  
 I 1 8 N . F o l d e r . S e n d   =   { } ;  
 I 1 8 N . F o l d e r . S e n d . S u c c e s s   =   ' { 0 }   h a s   b e e n   s e n t   s u c c e s s f u l l y ' ;  
 I 1 8 N . F o l d e r . S e n d . E r r o r   =   ' { 0 }   d e l i v e r y   f a i l e d .   I t   c a n n o t   b e   s e n t   t o   t h e   u s e r :   { 1 } . ' ;  
  
 I 1 8 N . F o l d e r . S h a r e   =   { } ;  
 I 1 8 N . F o l d e r . S h a r e . S u c c e s s   =   ' { 0 } h a s   b e e n   s h a r e d   s u c c e s s f u l l y . ' ;  
 I 1 8 N . F o l d e r . S h a r e . E r r o r   =   ' { 0 } s h a r i n g   f a i l e d .   C a n n o t   b e   s h a r e d   t o   t h e   u s e r : { 1 } . ' ;  
  
 I 1 8 N . F o l d e r . D r a g   =   { } ;  
 I 1 8 N . F o l d e r . D r a g . E r r o r   =   ' { 1 }   n a m e d   " { 0 } "   a l r e a d y   e x i s t s .   U n a b l e   t o   d r a g   i t . ' ;  
  
 I 1 8 N . F o l d e r . E x p o r t   =   { } ;  
 I 1 8 N . F o l d e r . E x p o r t . E r r o r   =   ' T h e   c h a r t   i s   e m p t y ,   a n d   c a n n o t   b e   e x p o r t e d . ' ;  
  
 I 1 8 N . F o l d e r . D e t a i l   =   { } ;  
 I 1 8 N . F o l d e r . D e t a i l . S u b T i t i l e   =   ' F r o m   { 0 } ' ;  
 I 1 8 N . F o l d e r . D e t a i l . T i t l e   =   { } ;  
 I 1 8 N . F o l d e r . D e t a i l . T i t l e . M e n u 1   =   ' C o p y ' ;  
 I 1 8 N . F o l d e r . D e t a i l . T i t l e . M e n u 2   =   ' S e n d ' ;  
 I 1 8 N . F o l d e r . D e t a i l . T i t l e . M e n u 3   =   ' D e l e t e ' ;  
 I 1 8 N . F o l d e r . D e t a i l . W i d g e t M e n u   =   { } ;  
 I 1 8 N . F o l d e r . D e t a i l . W i d g e t M e n u . M e n u 1   =   ' C o p y ' ;  
 I 1 8 N . F o l d e r . D e t a i l . W i d g e t M e n u . M e n u 2   =   ' S e n d ' ;  
 I 1 8 N . F o l d e r . D e t a i l . W i d g e t M e n u . M e n u 3   =   ' S h a r e ' ;  
 I 1 8 N . F o l d e r . D e t a i l . W i d g e t M e n u . M e n u 4   =   ' E x p o r t ' ;  
 I 1 8 N . F o l d e r . D e t a i l . W i d g e t M e n u . M e n u 5   =   ' D e l e t e ' ;  
  
 I 1 8 N . C o m m o d i t y   =   { } ;  
 I 1 8 N . C o m m o d i t y . O v e r v i e w   =   ' M e d i a   O v e r v i e w ' ;  
  
 I 1 8 N . H i e r a r c h y   =   { } ;  
 I 1 8 N . H i e r a r c h y . R a n k i n g B u t t o n N a m e   =   ' P l e a s e   s e l e c t   t h e   h i e r a r c h y   n o d e s   f o r   r a n k i n g ' ;  
 I 1 8 N . H i e r a r c h y . B u t t o n N a m e   =   ' P l e a s e   s e l e c t   t h e   h i e r a r c h y   n o d e ' ;  
 I 1 8 N . H i e r a r c h y . C o n f i r m   =   ' O k ' ;  
 I 1 8 N . H i e r a r c h y . C l e a r   =   ' C l e a r ' ;  
 I 1 8 N . H i e r a r c h y . M e n u 1   =   ' C u s t ' ;  
 I 1 8 N . H i e r a r c h y . M e n u 2   =   ' O r g ' ;  
 I 1 8 N . H i e r a r c h y . M e n u 3   =   ' S i t e ' ;  
 I 1 8 N . H i e r a r c h y . M e n u 4   =   ' B l d g ' ;  
  
 I 1 8 N . D i m   =   { } ;  
 I 1 8 N . D i m . A l l B u t t o n N a m e   =   ' A l l   d i m e n s i o n s ' ;  
 I 1 8 N . D i m . B u t t o n N a m e   =   ' D i m e n s i o n   n o d e ' ;  
  
 I 1 8 N . A L a r m   =   { } ;  
 I 1 8 N . A L a r m . M e n u 1   =   ' A l l ' ;  
 I 1 8 N . A L a r m . M e n u 2   =   ' A l a r m   s e t ' ;  
 I 1 8 N . A L a r m . M e n u 3   =   ' B a s e l i n e   s e t ' ;  
 I 1 8 N . A L a r m . M e n u 4   =   ' N o t   s e t ' ;  
  
 I 1 8 N . A L a r m . S a v e   =   { } ;  
 I 1 8 N . A L a r m . S a v e . T i t l e   =   ' A d d   t o   d a s h b o a r d ' ;  
 I 1 8 N . A L a r m . S a v e . L a b e l   =   ' C h a r t   n a m e ' ;  
 I 1 8 N . A L a r m . S a v e . S a v e   =   ' S a v e ' ;  
 I 1 8 N . A L a r m . S a v e . E r r o r   =   ' E x i s t e d ' ;  
  
 I 1 8 N . T a g   =   { } ;  
 I 1 8 N . T a g . T o o l t i p   =   ' T a g   { 0 }   /   { 1 }   h a s   b e e n   s e l e c t e d   ' ;  
 I 1 8 N . T a g . E x c e e d T o o l t i p   =   ' N u m b e r   o f   a d d e d   t a g s   i s   b e y o n d   t h e   r a n g e .   Y o u   c a n n o t   s e l e c t   a l l .   P l e a s e   s e l e c t   t h e   t a r g e t   t a g s   o n e   b y   o n e . ' ;  
 I 1 8 N . T a g . A l a r m S t a t u s 1   =   ' B a s e l i n e   n o t   s e t ' ;  
 I 1 8 N . T a g . A l a r m S t a t u s 2   =   ' B a s e l i n e   s e t ' ;  
 I 1 8 N . T a g . A l a r m S t a t u s 3   =   ' A l a r m   n o t   s e t ' ;  
 I 1 8 N . T a g . A l a r m S t a t u s 4   =   ' A l a r m   s e t ' ;  
  
 I 1 8 N . T e m p l a t e   =   { } ;  
 I 1 8 N . T e m p l a t e . C o p y   =   { } ;  
 I 1 8 N . T e m p l a t e . C o p y . D e s t i n a t i o n F o l d e r   =   ' T a r g e t   f o l d e r ' ;  
 I 1 8 N . T e m p l a t e . C o p y . C a n c e l   =   ' Q u i t ' ;  
 I 1 8 N . T e m p l a t e . C o p y . D e f a u l t N a m e   =   ' { 0 }   -   c o p y ' ;  
 I 1 8 N . T e m p l a t e . D e l e t e   =   { } ;  
 I 1 8 N . T e m p l a t e . D e l e t e . D e l e t e   =   ' D e l e t e ' ;  
 I 1 8 N . T e m p l a t e . D e l e t e . C a n c e l   =   ' Q u i t ' ;  
 I 1 8 N . T e m p l a t e . D e l e t e . T i t l e   =   ' D e l e t e   { 0 } ' ;  
 I 1 8 N . T e m p l a t e . D e l e t e . F o l d e r C o n t e n t   =   ' D e l e t e   f o l d e r   " { 0 } " .   A l l   c o n t e n t s   o f   t h e   f o l d e r   w i l l   a l s o   b e   d e l e t e d ' ;  
 I 1 8 N . T e m p l a t e . D e l e t e . W i d g e t C o n t e n t   =   ' C h a r t   " { 0 } "   w i l l   b e   d e l e t e d ' ;  
 I 1 8 N . T e m p l a t e . S h a r e   =   { } ;  
 I 1 8 N . T e m p l a t e . S h a r e . T i t l e   =   ' S h a r e   c h a r t ' ;  
 I 1 8 N . T e m p l a t e . S h a r e . S h a r e   =   ' S h a r e ' ;  
 I 1 8 N . T e m p l a t e . S h a r e . C a n c e l   =   ' Q u i t ' ;  
 I 1 8 N . T e m p l a t e . U s e r   =   { } ;  
 I 1 8 N . T e m p l a t e . U s e r . A l l u s e r   =   ' A l l   u s e r s ' ;  
 I 1 8 N . T e m p l a t e . U s e r . N a m e   =   ' N a m e ' ;  
 I 1 8 N . T e m p l a t e . U s e r . P o s i t i o n   =   ' T i t l e ' ;  
 I 1 8 N . T e m p l a t e . U s e r . S e l e c t e d   =   ' S e l e c t e d   { 0 }   p e r s o n ' ;  
 I 1 8 N . T e m p l a t e . S e n d   =   { } ;  
 I 1 8 N . T e m p l a t e . S e n d . T i t l e   =   ' S e n d   { 0 } ' ;  
 I 1 8 N . T e m p l a t e . S e n d . S e n d   =   ' S e n d ' ;  
 I 1 8 N . T e m p l a t e . S e n d . C a n c e l   =   ' Q u i t ' ;  
  
 I 1 8 N . T i t l e   =   { } ;  
 I 1 8 N . T i t l e . A l a r m   =   ' A l a r m ' ;  
 I 1 8 N . T i t l e . E n e r g y   =   ' E n e r g y ' ;  
  
 I 1 8 N . M a i l   =   { } ;  
 I 1 8 N . M a i l . S e n d B u t t o n   =   ' S e n d   p l a t f o r m   n o t i f i c a t i o n ' ;  
 I 1 8 N . M a i l . R e c i e v e r   =   ' R e c i e v e r ' ;  
 I 1 8 N . M a i l . T e m p l a t e   =   ' T e m p l a t e ' ;  
 I 1 8 N . M a i l . C o n t a c t o r   =   ' S P   C o n t a c t o r ' ;  
 I 1 8 N . M a i l . U s e r   =   ' P l a t f o r m   u s e r ' ;  
 I 1 8 N . M a i l . S e l e c t A l l   =   ' S e l e c t   a l l ' ;  
 I 1 8 N . M a i l . U s e r D e f i n e d   =   ' U s e r   D e f i n e ' ;  
 I 1 8 N . M a i l . D e l e t e   =   ' T e m p l a t e   " { 0 } " w i l l   b e   d e l e t e d ' ;  
 I 1 8 N . M a i l . S u b j e c t   =   ' S u b j e c t ' ;  
 I 1 8 N . M a i l . C o n t e n t   =   ' C o n t e n t ' ;  
 I 1 8 N . M a i l . S a v e N e w T e m p l a t e   =   ' S a v e   a s   n e w   t e m p l a t e ' ;  
 I 1 8 N . M a i l . M e s s a g e   =   ' S e n d   S M S ' ;  
 I 1 8 N . M a i l . T e m p l a t e H i n t T e x t   =   ' P l e a s e   i n p u t   t e m p l a t e   n a m e ' ;  
 I 1 8 N . M a i l . E r r o r   =   { } ;  
 I 1 8 N . M a i l . E r r o r . E 0 9 0   =   ' P l e a s e   f i l l   r e v i e v e r   t h e n   s e n d   i t   a g a i n ' ;  
 I 1 8 N . M a i l . E r r o r . E 0 9 1   =   ' P l e a s e   s e l e c t   t e m p l a t e ' ;  
 I 1 8 N . M a i l . E r r o r . E 0 9 4   =   ' P l e a s e   f i l l   t e m p l a t e   n a m e ' ;  
 I 1 8 N . M a i l . E r r o r . E 0 9 5   =   ' N a m e   a l r e a d y   e x i s t ' ;  
 I 1 8 N . M a i l . S e n d   =   { } ;  
 I 1 8 N . M a i l . S e n d . T i t l e   =   ' S e n d   m a i l ' ;  
 I 1 8 N . M a i l . S e n d . O k   =   ' O K ' ;  
 I 1 8 N . M a i l . S e n d . S e n d   =   ' S e n d ' ;  
 I 1 8 N . M a i l . S e n d . C a n c e l   =   ' C a n c e l ' ;  
 I 1 8 N . M a i l . S e n d . S u c c e s s   =   ' N o t i f i c a t i o n   i s   s e n t   s u c c e s s f u l l y ' ;  
 I 1 8 N . M a i l . S e n d . E 0 3 0 9 2   =   ' Y o u   m a i l   d o e s   n o t   h a v e   s u b j e c t ,   w o u l d   y o u   l i k e   t o   s e n d   a n y w a y ? ' ;  
 I 1 8 N . M a i l . S e n d . E 0 3 0 9 9   =   ' M a i l   s e n d   f a i l ,   p l e a s e   t r y   a g a i n . ' ;  
 I 1 8 N . M a i l . S e n d . E 0 3 0 9 9   =   ' M a i l   s e n d   f a i l ,   p l e a s e   t r y   a g a i n . ' ;  
  
 I 1 8 N . R a w D a t a   =   { } ;  
 I 1 8 N . R a w D a t a . T i m e   =   ' T i m e ' ;  
  
 I 1 8 N . S u m W i n d o w   =   { } ;  
 I 1 8 N . S u m W i n d o w . T i m e S p a n   =   ' T i m e s p a n ' ;  
 I 1 8 N . S u m W i n d o w . D a t a   =   ' T a g ' ;  
 I 1 8 N . S u m W i n d o w . S u m   =   ' S u m ' ;  
  
  
 m o d u l e . e x p o r t s   =   I 1 8 N ;  
 
