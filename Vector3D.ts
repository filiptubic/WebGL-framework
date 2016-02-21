/**
 * Vector3D
 */
class Vector3D {
    
    static EPSILON = 1.0e-10;
    
    m_x: number;
    m_y: number;
    m_z: number;
   

    constructor() 
    {
        this.zero();
    }
    
    Set(x: number, y: number, z: number) : void
    { 
        
        this.m_x = x; 
        this.m_y = y; 
        this.m_z = z; 
    }
    
    Init(x: number, y:number, z:number) : void
    {
        
        this.Set(x,y,z);
    }
    
    zero() : void
    {
        
        this.m_x = 0.0;
        this.m_y = 0.0;
        this.m_z = 0.0;
        
    }
    
    Copy(A: Vector3D) : void
    {
        
        this.m_x = A.m_x;
        this.m_y = A.m_y;
        this.m_z = A.m_z; 
    }
    
    DistSqr(A: Vector3D) : number
    {
        
        return (this.m_x - A.m_x)*(this.m_x - A.m_x) + (this.m_y - A.m_y)*(this.m_y - A.m_y) + (this.m_z - A.m_z)*(this.m_z - A.m_z);
    }

    Dist(A: Vector3D) : number
    {
        
        return Math.sqrt(this.DistSqr(A));
    }
    
    Norm() : number
    {
        
        return Math.sqrt(this.NormSqr());
    }
    
    NormSqr() : number
    {
        
        return this.m_x*this.m_x + this.m_y*this.m_y + this.m_z*this.m_z;
    }
    
    Cross(v: Vector3D) : Vector3D
    {
        
        var A: Vector3D = new Vector3D();
      
        A.m_x = this.m_y*v.m_z - this.m_z*v.m_y;
        A.m_y = this.m_z*v.m_x - this.m_x*v.m_z;
        A.m_z = this.m_x*v.m_y - this.m_y*v.m_x;
        
        return A;
    }
    
    opConcatByVector3D(A: Vector3D) : void
    {
        
        this.m_x+=A.m_x;
        this.m_y+=A.m_y;
        this.m_z+=A.m_z;
    }
 
    opSubstractByVector3D(A: Vector3D) : void
    {
        
        this.m_x-=A.m_x;
        this.m_y-=A.m_y;
        this.m_z-=A.m_z;
    }
 
    opMultiplyByScalar(k: number) : void
    {
        
        this.m_x*=k;
        this.m_y*=k;
        this.m_z*=k;
    }
    
    Normalize() : void
    {
        
        var norm = this.Norm();
        if (norm <= Vector3D.EPSILON){
            this.zero();
        }
        else{
            this.m_x /= norm;
            this.m_y /= norm;
            this.m_z /= norm;
        }
    }

    add(A: Vector3D, B: Vector3D) : void
    {
        
        this.m_x=A.m_x + B.m_x;
        this.m_y=A.m_y + B.m_y;
        this.m_z=A.m_z + B.m_z;
    }

    sub(A: Vector3D,B: Vector3D) : void
    {
        
        this.m_x=A.m_x - B.m_x;
        this.m_y=A.m_y - B.m_y;
        this.m_z=A.m_z - B.m_z;
    }

    cross(A: Vector3D, B: Vector3D) : void
    {
        
        this.m_x=A.m_y*B.m_z - A.m_z*B.m_y;
        this.m_y=A.m_z*B.m_x - A.m_x*B.m_z;
        this.m_z=A.m_x*B.m_y - A.m_y*B.m_x;
    }

    normal(A: Vector3D, B: Vector3D, C: Vector3D) : void
    {
        var P: Vector3D;
        var Q: Vector3D;

        P.sub(C,B);
        Q.sub(A,B);
        this.cross(P,Q);
        this.Normalize();
    }
        
    
}