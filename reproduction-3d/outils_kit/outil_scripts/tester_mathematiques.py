#!/usr/bin/env python3
"""Tests indépendants de la trajectoire de référence (sans navigateur).
But : repérer les resets yaw / interpolation incorrecte, pas tester le rendu WebGL.
"""
from math import isclose
poses=[
(-.34,1.43),(.56,1.65),(1.65,-2.55),(3.25,1.20),(4.93,-2.70),(6.55,2.40),(8.21,-2.62)]
def mix(t):
 t=max(0,min(6,t));i=min(5,int(t));u=t-i
 a=poses[i];b=poses[i+1];before=poses[max(0,i-1)][0];after=poses[min(6,i+2)][0]
 d0=(b[0]-a[0]) if i==0 else (b[0]-before)/2
 d1=(b[0]-a[0]) if i==5 else (after-a[0])/2
 u2=u*u;u3=u2*u
 yaw=(2*u3-3*u2+1)*a[0]+(u3-2*u2+u)*d0+(-2*u3+3*u2)*b[0]+(u3-u2)*d1
 blend=u2*(3-2*u)
 return yaw,a[1]+(b[1]-a[1])*blend
def smooth(a,b,x):
 u=max(0,min(1,(x-a)/(b-a)))
 return u*u*(3-2*u)
def state(v):return tuple(smooth(a,b,v) for a,b in ((.03,.32),(.13,.57),(.48,.68),(.66,.81),(.79,.985)))
for i,(yaw,x) in enumerate(poses):
 assert isclose(mix(i)[0],yaw,abs_tol=1e-12)
 assert isclose(mix(i)[1],x,abs_tol=1e-12)
for j in range(1,600):
 # Aux valeurs de la route originale, le yaw est strictement croissant.
 assert mix(j/100)[0] > mix((j-1)/100)[0],f'Yaw bloqué à {j/100}'
for i in range(101):
 v=i/100
 assert all(0<=x<=1 for x in state(v))
 assert all(abs(x-y)<1e-12 for x,y in zip(state(v),state(v)))
 assert state(v)[4] <= state(v)[3] or v>.81
print('OK : 7 poses, rotation Y continue, lissage de progression et séquence coffre réversible')